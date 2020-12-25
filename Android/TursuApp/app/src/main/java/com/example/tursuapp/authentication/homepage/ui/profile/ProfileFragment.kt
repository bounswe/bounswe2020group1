package com.example.tursuapp.authentication.homepage.ui.profile

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import androidx.core.view.GravityCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.account.AccountFragment
import com.example.tursuapp.authentication.homepage.ui.account.AccountViewModel
import com.example.tursuapp.authentication.homepage.ui.order.CustomerOrdersFragment

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

        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        view.findViewById<ImageView>(R.id.back_button).setOnClickListener {
            activity?.supportFragmentManager?.beginTransaction()
                    ?.replace(R.id.nav_host_fragment, AccountFragment())
                    ?.commit()
        }

    }

}