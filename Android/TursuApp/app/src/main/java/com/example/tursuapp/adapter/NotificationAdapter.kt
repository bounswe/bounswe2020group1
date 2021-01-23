package com.example.tursuapp.adapter

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.RecyclerView
import com.example.tursuapp.R
import com.example.tursuapp.api.responses.NotificationResponse
import com.example.tursuapp.api.responses.VendorResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.order.CustomerOrdersFragment
import com.example.tursuapp.authentication.homepage.ui.productpage.ProductPageFragment
import com.example.tursuapp.authentication.homepage.ui.profile.PublicVendorFragment
import com.example.tursuapp.authentication.homepage.ui.vendorproductpage.VendorProductPageFragment

// For vendors in Grid view
class NotificationAdapter(val userType:String,val mContext: Context, private var notificationListText: MutableList<String>, private var notifications:List<NotificationResponse>) : RecyclerView.Adapter<NotificationAdapter.ViewHolder>() {
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.textView.text = notificationListText[position]
        holder.itemView.setOnClickListener {
            if(notifications[position].type == 1){
                fragmentJump(notifications[position],null);
            }
            else {
                val bundle = Bundle()
                bundle.putString("id",notifications[position].product_id.toString())
            }

        }
    }
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(LayoutInflater.from(mContext).inflate(R.layout.notification_item_layout, parent, false))
    }
    private fun fragmentJump(mItemSelected: NotificationResponse,bundle: Bundle?) {
        lateinit var newFragment:Fragment
        if(mItemSelected.type == 1){
            if(userType == "vendor"){
                if(userType == "vendor"){
                    newFragment = VendorProductPageFragment()
                }
                else{
                    newFragment = ProductPageFragment()
                }
            }
        }
        else if(mItemSelected.type == 2){
            newFragment = VendorProductPageFragment()
        }
        else{
            newFragment = ProductPageFragment()
        }
        if(bundle!=null) {
            newFragment.arguments = bundle
        }
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
        return notificationListText.size
    }
    inner class ViewHolder (view: View) : RecyclerView.ViewHolder(view) {
        var textView = view.findViewById<TextView>(R.id.notif_text_view)

    }
}
