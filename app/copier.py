from json import loads

folder_mimeType = 'application/vnd.google-apps.folder'
batch_max = 100
anyone_permission = {
                        "type": "anyone",
                        "role": "reader",
                        "allowFileDiscovery": False
                    }


class Copier:
    def __init__(self, service):
        self.service = service

    def copy_files(self, file_metadatas, destination_id):
        files_api = self.service.files()

        copy_responses = {}

        def copy_callback(request_id, response, exception):
            copy_responses[request_id] = {
                'error': None,
                'id': None,
                'name': None,
                'webViewLink': None
            }
            if exception:
                copy_responses[request_id]['error'] = loads(exception.content)['error']['errors'][0]['message']
            else:
                copy_responses[request_id]['id'] = response['id']
                copy_responses[request_id]['name'] = response['name']
                copy_responses[request_id]['webViewLink'] = response['webViewLink']

        copy_batch = self.service.new_batch_http_request(callback=copy_callback)

        requests_count = 0
        for file_id in file_metadatas:
            if requests_count >= batch_max:
                copy_batch.execute()
                requests_count = 0
                copy_batch = self.service.new_batch_http_request(callback=copy_callback)
            try:
                body = {
                    'parents': [destination_id]
                }
                # if public:
                #     body['permissions'] = [anyone_permission]

                copy_batch.add(
                    files_api.copy(
                        fileId=file_id,
                        fields='id, name, webViewLink',
                        supportsAllDrives=True,
                        body=body),
                    request_id=file_id
                )
                requests_count += 1
            except:
                pass

        copy_batch.execute()

        return copy_responses

    def get_files(self, file_ids):
        files_api = self.service.files()

        get_responses = {}

        def get_callback(request_id, response, exception):
            get_responses[request_id] = {
                'error': None,
                'name': None,
                'mimeType': None,
                'description': None
            }
            if exception:
                get_responses[request_id]['error'] = loads(exception.content)['error']['errors'][0]['message']
            else:
                get_responses[request_id]['name'] = response['name']
                get_responses[request_id]['mimeType'] = response['mimeType']
                if get_responses[request_id].get('description'):
                    get_responses[request_id]['description'] = response['description']

        get_batch = self.service.new_batch_http_request(callback=get_callback)

        requests_count = 0

        for file_id in file_ids:
            if requests_count >= batch_max:
                get_batch.execute()
                requests_count = 0
                get_batch = self.service.new_batch_http_request(callback=get_callback)
            try:
                get_batch.add(
                    files_api.get(
                        fileId=file_id,
                        fields='name, mimeType, description',
                        supportsAllDrives=True),
                    request_id=file_id
                )
                requests_count += 1
            except:
                pass

        get_batch.execute()

        return get_responses

    # get origin folder name
    # create folder copy
    # get the metadata on files and subfolders of origin folder
    # separate files from folders
    # copy the files to folder copy
    # create subfolder copies in folder copy
    # recurse on subfolder copies
    def copy_folder(self, folder_metadata, destination_id):
        files_api = self.service.files()

        # get the metadata on files and subfolders of origin folder
        # do not include deleted files
        query_string = "'%s' in parents and trashed = false" % folder_metadata['id']

        # separate files from folders
        page_token = None
        source_file_metadatas = {}
        source_folder_metadatas = {}
        while True:
            response = files_api.list(
                q=query_string,
                includeItemsFromAllDrives=True,
                supportsAllDrives=True,
                pageToken=page_token,
                pageSize=1000,
                fields='nextPageToken, files(id, name, mimeType, description)'
            ).execute()

            for metadata in response.get('files', []):
                if metadata.get('mimeType') == folder_mimeType:
                    source_folder_metadatas[metadata['id']] = metadata
                else:
                    source_file_metadatas[metadata['id']] = metadata

            page_token = response.get('nextPageToken')
            # end of files list reached
            if page_token is None:
                break

        # create the copied folder
        body = {
            'name': folder_metadata['name'],
            'mimeType': 'application/vnd.google-apps.folder',
            'parents': [destination_id]
        }
        if folder_metadata.get('description'):
            body['description'] = folder_metadata['description']

        # if public:
        #     body['permissions'] = [anyone_permission]

        # create folder copy
        copied_folder_response = files_api.create(
            body=body,
            fields='id, name, webViewLink',
            supportsAllDrives=True).execute()

        copied_folder_id = copied_folder_response['id']

        # copy the files to folder copy
        self.copy_files(source_file_metadatas, copied_folder_id)

        # recurse for every subfolder
        for source_subfolder_metadata in source_folder_metadatas.values():
            self.copy_folder(source_subfolder_metadata, copied_folder_id)

        copied_folder_response['error'] = None

        return copied_folder_response

    def make_public(self, file_metadatas):
        permissions_api = self.service.permissions()

        permission_batch = self.service.new_batch_http_request()

        requests_count = 0
        for file_id in file_metadatas:
            if requests_count >= batch_max:
                permission_batch.execute()
                requests_count = 0
                permission_batch = self.service.new_batch_http_request()
            try:
                if file_metadatas[file_id].get('error') is None:
                    permission_batch.add(
                        permissions_api.create(
                            fileId=file_id,
                            supportsAllDrives=True,
                            body=anyone_permission,
                        )
                    )
                requests_count += 1
            except:
                pass

        permission_batch.execute()

    def make_copies(self, file_ids, destination='root', public=False):
        get_errors = {}

        get_responses = self.get_files(file_ids)

        # separate folders, files and get errors
        folder_metadatas = {}
        file_metadatas = {}
        for file_id in file_ids:
            get_response = get_responses[file_id]
            if get_response.get('error'):
                get_errors[file_id] = get_response
            else:
                # no get error separate files from folders
                if get_response['mimeType'] == folder_mimeType:
                    folder_metadatas[file_id] = get_response
                else:
                    file_metadatas[file_id] = get_response

        # copy the files, not folders
        copy_responses = {}
        if file_metadatas:
            copy_responses = self.copy_files(file_metadatas, destination)

        # copy the folders
        copied_folders_responses = {}
        if folder_metadatas:
            for folder_id in folder_metadatas:
                folder_metadata = folder_metadatas[folder_id]
                folder_metadata['id'] = folder_id
                response = self.copy_folder(folder_metadata, destination)
                copied_folders_responses[response['id']] = response

        if public:
            self.make_public(copy_responses)
            self.make_public(copied_folders_responses)

        return list(get_errors.values()) + list(copy_responses.values()) + list(copied_folders_responses.values())
