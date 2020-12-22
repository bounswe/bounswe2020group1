package com.example.tursuapp.adapter

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ImageView
import android.widget.TextView
import com.example.tursuapp.R
import com.example.tursuapp.api.responses.ProductResponse
import com.example.tursuapp.authentication.homepage.ui.order.CustomerOrder
import com.squareup.picasso.Picasso

//For products in grid view

class OrderAdapter(context: Context, private var orderList: List<CustomerOrder>) : BaseAdapter() {
    var context: Context? = context

    override fun getCount(): Int {
        return orderList.size
    }

    override fun getItem(position: Int): Any {
        return orderList[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    @SuppressLint("SetTextI18n", "ViewHolder", "InflateParams")
    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        //val food = this.productList[position]

        val inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val orderView = inflator.inflate(R.layout.order_layout, null)
        orderView.findViewById<TextView>(R.id.cus_order_status).text = orderList[position].status
        orderView.findViewById<TextView>(R.id.cus_order_quantity).text = orderList[position].quantity.toString()
        orderView.findViewById<TextView>(R.id.cus_order_price).text = orderList[position].price+"TL"
        //foodView.findViewById<ImageView>(R.id.img_product).setImageResource(R.drawable.tursu_logo)
        return orderView
    }
}