from django.apps import AppConfig


class ProductConfig(AppConfig):
    name = 'product'
    def ready(self):
        from actstream import registry
        registry.register(self.get_model('Product'))
        registry.register(self.get_model('Category'))
        registry.register(self.get_model('Image'))
