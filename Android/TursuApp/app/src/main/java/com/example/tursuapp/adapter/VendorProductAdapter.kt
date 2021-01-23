package com.example.tursuapp.adapter

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.RatingBar
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.RecyclerView
import com.example.tursuapp.MainActivity
import com.example.tursuapp.R
import com.example.tursuapp.api.responses.ProductResponse
import com.example.tursuapp.api.responses.VendorProductLists
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.productpage.ProductPageFragment
import com.example.tursuapp.authentication.homepage.ui.vendorproductpage.VendorProductPageFragment
import com.squareup.picasso.Picasso


class VendorProductAdapter(val mContext: Context, private val children: List<VendorProductLists>)
    : RecyclerView.Adapter<VendorProductAdapter.ViewHolder>(){

    override fun onCreateViewHolder(parent: ViewGroup,
                                    viewType: Int): ViewHolder {

        val v =  LayoutInflater.from(parent.context)
            .inflate(R.layout.product_layout, parent, false)
        return ViewHolder(v)
    }

    override fun getItemCount(): Int {
        return children.size
    }

    override fun onBindViewHolder(holder: ViewHolder,
                                  position: Int) {
        val product = children[position]
        holder.product_id.text = product.id.toString()
        holder.product_name.text = product.name
        holder.poduct_price.text = product.price
        holder.product_rating.rating = product.rating.toFloat()
        if(product.photo_url!="") {
            Picasso
                .get() // give it the context
                .load(product.photo_url) // load the image
                .tag("resume_tag")
                .into(holder.product_img)
        }
        else{
            holder.product_img.setImageResource(R.drawable.ic_menu_camera)
        }
        holder.itemView.setOnClickListener {
            fragmentJump(product);
            /*
            .activity?.supportFragmentManager?.beginTransaction()
                    ?.replace(R.id.nav_host_fragment, newFragment)?.addToBackStack(null)
                    ?.commit()

             */
        }
    }
    private fun fragmentJump(mItemSelected: VendorProductLists) {
        val bundle = Bundle()
        bundle.putString("id", mItemSelected.id.toString())
        val newFragment = VendorProductPageFragment()
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
    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView){

        var product_id = itemView.findViewById<TextView>(R.id.product_id)
        var product_name = itemView.findViewById<TextView>(R.id.text_product)
        var poduct_price = itemView.findViewById<TextView>(R.id.price_product)
        var product_img = itemView.findViewById<ImageView>(R.id.img_product)
        var product_rating = itemView.findViewById<RatingBar>(R.id.product_rating_bar)

    }
}