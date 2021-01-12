from django.apps import AppConfig


class OrderConfig(AppConfig):
    name = 'order'
    def ready(self):
        from actstream import registry
        registry.register(self.get_model('Order'))
