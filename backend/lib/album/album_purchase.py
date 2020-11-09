from lib.user.user import User
from lib.album.album import Album

def get_price(_user, _album):
    # Price for the current user
    your_price = 0
    # Price with discounts, no ownership
    discounted_price = 0
    # Price without prior ownership, without discounts
    original_price = 0
    # Savings on all discounts and ownership
    savings = 0

    raw_album_discount = _album.get_discount()

    for photo in _album.get_photos():
        if photo not in _user.get_purchased():
            your_price += photo.get_discounted_price()
            discounted_price += photo.get_discounted_price()
        original_price += photo.get_price()

    # Add the additional album discount
    your_price = int(your_price - (discounted_price * (raw_album_discount / 100)))
    savings = original_price - your_price

    return {
        'yourPrice': str(your_price),
        'originalPrice': str(original_price),
        'rawAlbumDiscount': str(raw_album_discount),
        'savings': str(original_price - your_price)
    }

def purchase_album(user_id, album_id):
    """
    Purchase album. Add photos to purchased for buyer.
    Reduce credits for buyer and increase credits for photo owner.

    """
    buyer = User.objects.get(id=user_id)
    album = Album.objects.get(id=album_id)
    album_owner = album.get_created_by().get_id()
    seller = User.objects.get(id=album_owner)
    
    # Check that the buyer is not the seller
    if buyer.get_id() == seller.get_id():
        raise Error.ValueError("You cannot buy your own album")

    album_photos = album.get_photos()
    buyer_photos = buyer.get_purchased()
    
    # Get price for buyer. Only includes photos which they
    # have not yet purchased
    album_price = int(get_price(buyer, album)['yourPrice'])

    # Check that the buyer has sufficient money
    buyer_credits = buyer.get_credits()
    if buyer_credits < album_price:
        raise Error.ValueError("You don't have enough credits to buy this photo.")

    # Exchange credits
    buyer.remove_credits(album_price)

    # Seller gets 80% of profits. Photopro takes 20%
    seller.add_credits(int(0.80 * album_price))
    
    # Add photos to buyer's purchased list
    for photo in album_photos:
        if photo not in buyer.get_purchased() and not photo.is_deleted():
            buyer.add_purchased(photo)

    buyer.save()
    seller.save()

    return {"purchased": True}