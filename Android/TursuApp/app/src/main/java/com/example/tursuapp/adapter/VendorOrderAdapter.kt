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
import com.example.tursuapp.api.responses.VendorOrderLists
import com.example.tursuapp.api.responses.VendorProductLists
import com.example.tursuapp.authentication.homepage.ui.order.CustomerOrder
import com.squareup.picasso.Picasso

//For products in grid view

class VendorOrderAdapter(context: Context, private var orderList: List<VendorOrderLists>,private var productList: List<VendorProductLists>) : BaseAdapter() {
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
        val orderView = inflator.inflate(R.layout.vendor_order_layout, null)
        orderView.findViewById<TextView>(R.id.textView30).text = "Order ID: "+orderList[position].id
        orderView.findViewById<TextView>(R.id.textView31).text = "Customer: "+orderList[position].customer
        orderView.findViewById<TextView>(R.id.textView32).text = "Product ID: "+orderList[position].product
        orderView.findViewById<TextView>(R.id.textView34).text = "Status: "+orderList[position].status
        orderView.findViewById<TextView>(R.id.textView35).text = "Cargo ID: "+orderList[position].cargoID
        orderView.findViewById<TextView>(R.id.textView36).text = "Order Date: "+orderList[position].orderDate
        orderView.findViewById<TextView>(R.id.textView37).text = "Estimated Arrival Date: "+orderList[position].estimatedArrivalDate
        orderView.findViewById<TextView>(R.id.textView38).text = "ArrivalDate: "+orderList[position].arrivalDate
        orderView.findViewById<TextView>(R.id.textView39).text = "Quantity: "+orderList[position].quantity
        orderView.findViewById<TextView>(R.id.textView40).text = "Comment: "+orderList[position].comment
        val image  = orderView.findViewById<ImageView>(R.id.vendor_order_product_photo_url)
        if(productList[position].photo_url!="") {
            Picasso
                    .get() // give it the context
                    .load(productList[position].photo_url) // load the image
                    .into(image)
        }
        else{
            image.setImageResource(R.drawable.ic_menu_camera)
        }
        return orderView
    }
}