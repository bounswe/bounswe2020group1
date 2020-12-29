package com.example.tursuapp.authentication.homepage.ui.profile

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import androidx.core.view.GravityCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.order.CustomerOrdersFragment
import com.example.tursuapp.authentication.login.LoginActivity

class ProfileFragment : Fragment() {

    private lateinit var galleryViewModel: ProfileViewModel

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        galleryViewModel =
                ViewModelProvider(this).get(ProfileViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_customer_profile, container, false)

        val button: Button = root!!.findViewById(R.id.logout_button) as Button
        button.setOnClickListener {
            val pref = activity?.applicationContext?.getSharedPreferences("UserPref", 0)
            if (pref != null) {
                with(pref.edit()) {
                    remove("first_name")
                    remove("last_name")
                    remove("user_type")
                    remove("auth_token")
                    putBoolean("logged_in", false)
                    apply()
                }
            }
            val intent = Intent(activity?.applicationContext, LoginActivity::class.java)
            startActivity(intent)
            activity?.finish()

        }

        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        view.findViewById<ImageView>(R.id.back_button).setOnClickListener {
            (activity as HomePageActivity).displayFragment(R.id.nav_home,0,"",null)
        }

    }

}