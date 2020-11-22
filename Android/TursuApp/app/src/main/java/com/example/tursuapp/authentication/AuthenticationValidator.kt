package com.example.tursuapp.authentication

class AuthenticationValidator {
    companion object{
        fun validateEmail(email : String) : Boolean{
            val pattern = Regex("^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]\$")

            return email.matches(pattern)
        }
    }
}