from re import search


def extractIds(pattern, links):
    file_ids = []

    for link in links:
        match = search(pattern, link)
        if match:
            file_ids.append(match[0])
        else:
            print('Can\'t get id from ', link)

    return file_ids
