package com.example.tursuapp.authentication.homepage.ui.account

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.core.view.GravityCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.profile.ProfileFragment

class AccountFragment : Fragment() {

    private lateinit var galleryViewModel: AccountViewModel

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        galleryViewModel =
                ViewModelProvider(this).get(AccountViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_account, container, false)
        galleryViewModel.text.observe(viewLifecycleOwner, {

        })
        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        view.findViewById<LinearLayout>(R.id.linearLayoutProfile).setOnClickListener {
            displayFragment(R.id.nav_profile_detail)
        }
    }
    private fun displayFragment(id:Int){
        lateinit var fragment: Fragment
        if(id == R.id.nav_profile_detail){
            fragment = ProfileFragment()
        }
        activity?.supportFragmentManager?.beginTransaction()
                ?.replace(R.id.nav_host_fragment, fragment)
                ?.commit()
        (activity as HomePageActivity).drawer.closeDrawer(GravityCompat.START)
    }
}