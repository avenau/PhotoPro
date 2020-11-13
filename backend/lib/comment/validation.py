'''
Comment Validation
'''
import traceback
import mongoengine
import lib.Error as Error
import lib.user.User as user

def validate_posted(posted):
    '''
    @param posted:datetime
    '''
    try:
        mongoengine.DateTimeField().validate(posted)
    except mongoengine.ValidationError:
        print(traceback.print_exc())
        raise Error.ValidationError("Comment date is not valid")


def validate_content(content):
    '''
    @param content:string
    '''
    try:
        mongoengine.StringField().validate(content)
    except mongoengine.ValidationError:
        print(traceback.print_exc())
        raise Error.ValidationError("Comment string is not valid")
