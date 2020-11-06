'''
Album Functions
'''

def update_album(_album, title, discount, tags):
    '''
    @param title: string
    @param discount: int
    @param tags: [string]
    @return success: boolean
    '''
    if title:
        _album.set_title(title)
    if discount:
        _album.set_discount(discount)
    if tags:
        _album.set_tags(tags)
    _album.save()
    return True
