from django.apps import AppConfig


class ShoppingCartConfig(AppConfig):
    name = 'shopping_cart'
    def ready(self):
        from actstream import registry
        registry.register(self.get_model('ShoppingCarts'))
