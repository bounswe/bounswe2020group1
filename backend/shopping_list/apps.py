from django.apps import AppConfig


class ShoppingListConfig(AppConfig):
    name = 'shopping_list'
    def ready(self):
        from actstream import registry
        registry.register(self.get_model('ProductLists'))
        registry.register(self.get_model('ListedProducts'))