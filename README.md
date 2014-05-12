super1click2cart
================

Easily add all combinations of different colors/sizes/etc to shopping cart, available for alibaba/taobao/tmall.

## update history

#### version 0.2

 1. Add all steps into one button, one click for all.


#### vesion 0.1.2

 1. fix for some pages which only have one spec, either no color options or no size options.

    [item without size options](http://detail.1688.com/offer/36427557391.html) as example.

 2. deal with "*huopin*" pages.


#### vesion 0.1.1

 1. use options page and `localSotrage` to save URLs



## up-comming

 1. move main logic and code to background page, instead of popup page.

 2. introduce a state machine to maintain lifetime state of extension.

 3. use `setInterval/setTimeout`, instead of ugly `sleep()` for time delay.

 4. **new feature** add support for auto-login.

 5. use options page and `localSotrage` ali/taobao accounts.


## need to fix

 1. some color/size spec are not available, we need to skip these cases, instead of click.

