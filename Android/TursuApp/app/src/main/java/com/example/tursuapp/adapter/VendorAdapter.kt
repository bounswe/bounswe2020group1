package com.example.tursuapp.adapter

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ImageView
import android.widget.RatingBar
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.RecyclerView
import com.example.tursuapp.R
import com.example.tursuapp.api.responses.ProductResponse
import com.example.tursuapp.api.responses.VendorResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.productpage.ProductPageFragment
import com.example.tursuapp.authentication.homepage.ui.profile.PublicVendorFragment
import com.squareup.picasso.Picasso

// For vendors in Grid view
class VendorAdapter(val mContext: Context, private var vendorList: ArrayList<VendorResponse>) : RecyclerView.Adapter<VendorAdapter.ViewHolder>() {
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.vendor_name.text = vendorList[position].name
        holder.location_product.text = vendorList[position].city
        holder.ratingBarVendor.rating = vendorList[position].rating.toFloat()
        holder.itemView.setOnClickListener {
            fragmentJump(vendorList[position]);
        }
    }
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(LayoutInflater.from(mContext).inflate(R.layout.vendor_layout, parent, false))
    }
    private fun fragmentJump(mItemSelected: VendorResponse) {
        val bundle = Bundle()
        bundle.putString("vendor_name", mItemSelected.name)
        val newFragment = PublicVendorFragment()
        newFragment.arguments = bundle
        switchContent(R.id.nav_host_fragment, newFragment)
    }
    fun switchContent(id: Int, fragment: Fragment) {
        if (mContext == null) return
        if (mContext is HomePageActivity) {
            val mainActivity = mContext as HomePageActivity
            val frag: Fragment = fragment
            mainActivity.switchContent(id, frag)
        }
    }
    override fun getItemCount(): Int {
        return vendorList.size
    }
    inner class ViewHolder (view: View) : RecyclerView.ViewHolder(view) {
        var vendor_name = view.findViewById<TextView>(R.id.name_vendor)
        var location_product = view.findViewById<TextView>(R.id.location_product)
        var ratingBarVendor = view.findViewById<RatingBar>(R.id.ratingBarVendor)

    }
}
