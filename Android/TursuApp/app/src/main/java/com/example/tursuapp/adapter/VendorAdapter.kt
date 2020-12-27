package com.example.tursuapp.adapter

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.RatingBar
import android.widget.TextView
import com.example.tursuapp.R
import com.example.tursuapp.api.responses.VendorResponse

// For vendors in Grid view
class VendorAdapter(context: Context, private var vendorList: ArrayList<VendorResponse>) : BaseAdapter() {
    var context: Context? = context

    override fun getCount(): Int {
        return vendorList.size
    }

    override fun getItem(position: Int): Any {
        return vendorList[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    @SuppressLint("SetTextI18n", "ViewHolder", "InflateParams")
    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val productView = inflator.inflate(R.layout.vendor_layout, null)
        productView.findViewById<TextView>(R.id.name_vendor).text = this.vendorList[position].name.toString()
        productView.findViewById<TextView>(R.id.location_product).text = this.vendorList[position].location
        productView.findViewById<RatingBar>(R.id.ratingBarVendor).rating = this.vendorList[position].rating.toFloat()
        return productView
    }
}