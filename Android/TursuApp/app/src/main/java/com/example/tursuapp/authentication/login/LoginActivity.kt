package com.example.tursuapp.authentication.login

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.tursuapp.R
import com.example.tursuapp.authentication.forgotpassword.ForgotPasswordActivity
import com.example.tursuapp.authentication.signup.SignUpActivity

class LoginActivity : AppCompatActivity() {
    private lateinit var email : EditText
    private lateinit var password: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        email = findViewById(R.id.login_email)
        password = findViewById(R.id.login_password)

        findViewById<TextView>(R.id.register_button).setOnClickListener {
            startActivity(Intent(this, SignUpActivity::class.java))
        }

        findViewById<TextView>(R.id.forgot_password_button).setOnClickListener {
            startActivity(Intent(this, ForgotPasswordActivity::class.java))
        }

        findViewById<Button>(R.id.login_button).apply {
            this.setOnClickListener {
                login(this)
            }
        }

    }

    private fun login(button: Button){

    }

}