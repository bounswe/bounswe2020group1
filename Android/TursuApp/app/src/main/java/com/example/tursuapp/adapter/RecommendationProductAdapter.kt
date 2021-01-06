package com.example.tursuapp.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.tursuapp.R
import com.example.tursuapp.api.responses.ProductResponse

class RecommendationProductAdapter(val course_names:ArrayList<ProductResponse>,val context: Context) : RecyclerView.Adapter<ViewHolder>() {
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.product_id.text = course_names[position].id.toString()
        holder.product_name.text = course_names[position].name
        holder.poduct_price.text = course_names[position].price
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(LayoutInflater.from(context).inflate(R.layout.product_layout, parent, false))
    }

    override fun getItemCount(): Int {
        return course_names.size
    }

}
class ViewHolder (view: View) : RecyclerView.ViewHolder(view) {
    var product_id = view.findViewById<TextView>(R.id.product_id)
    var product_name = view.findViewById<TextView>(R.id.text_product)
    var poduct_price = view.findViewById<TextView>(R.id.price_product)

}