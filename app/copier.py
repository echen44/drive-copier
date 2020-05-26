from json import loads


class Copier:
    def __init__(self, service):
        self.service = service
        self.error_responses = None
        self.get_responses = None
        self.copy_responses = None
        self.responses = None

    def __generate_ids(self, count):
        files_api = self.service.files()
        return files_api.generateIds(
            count=count,
            space='drive'
        ).execute()['ids']

    def __get_callback(self, request_id, response, exception):
        if self.responses is None:
            self.responses = {}
        if self.error_responses is None:
            self.error_responses = {}
        if self.get_responses is None:
            self.get_responses = {}
        if exception is not None:
            # Error
            # message = loads(exception.content)['error']['errors'][0]['message']
            self.error_responses[request_id] = {
                'name': None,
                'origin_id': request_id,
                'copy_id': None,
                'link': None,
                'error': loads(exception.content)['error']['errors'][0]['message']
            }
        else:
            # No error
            self.get_responses[request_id] = {
                'name': response['name'],
                'origin_id': request_id,
                'copy_id': None,
                'link': None,
                'error': None
            }

    def __copy_callback(self, request_id, response, exception):
        if exception is not None:
            # Error
            self.error_responses[request_id] = self.get_responses[request_id]
            self.error_responses[request_id]['error'] = loads(exception.content)['error']['errors'][0]['message']
        else:
            # No error
            self.copy_responses[request_id] = {
                'name': response['name'],
                'origin_id': request_id,
                'copy_id': response['id'],
                'link': response['webContentLink'],
                'error': None
            }

    def make_copies(self, file_ids, destination='root', public=False):
        self.error_responses = {}
        self.get_responses = {}
        self.copy_responses = {}
        self.responses = {}
        files_api = self.service.files()

        get_batch = self.service.new_batch_http_request(callback=self.__get_callback)
        for file_id in file_ids:
            get_batch.add(
                files_api.get(fileId=file_id),
                request_id=file_id
            )
        get_batch.execute()

        copy_batch = self.service.new_batch_http_request(callback=self.__copy_callback)
        for item in self.get_responses:
            if self.get_responses[item] is not None:
                copy_batch.add(
                    files_api.copy(
                        fileId=self.get_responses[item]['origin_id'],
                        fields='id, name, webContentLink',
                        body={
                            'parents': [destination]
                        }),
                    request_id=self.get_responses[item]['origin_id']
                )
        copy_batch.execute()

        if public:
            permissions_api = self.service.permissions()
            anyone_permission = {
                        "type": "anyone",
                        "role": "reader",
                        "allowFileDiscovery": False
            }
            permission_batch = self.service.new_batch_http_request()
            for item in self.copy_responses:
                permission_batch.add(
                    permissions_api.create(
                        fileId=self.copy_responses[item]['copy_id'],
                        body=anyone_permission,
                    )
                )
            permission_batch.execute()

        return list(self.error_responses.values()) + list(self.copy_responses.values())
