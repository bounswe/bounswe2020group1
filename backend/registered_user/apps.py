from django.apps import AppConfig


class RegisteredUserConfig(AppConfig):
    name = 'registered_user'
    def ready(self):
        from actstream import registry
        registry.register(self.get_model('Vendor'))
        registry.register(self.get_model('Customer'))
        registry.register(self.get_model('RegisteredUser'))
