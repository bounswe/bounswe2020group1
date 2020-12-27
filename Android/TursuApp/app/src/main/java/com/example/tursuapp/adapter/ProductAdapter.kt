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
import com.squareup.picasso.Picasso

//For products in grid view

class ProductAdapter(context: Context, private var productList: ArrayList<ProductResponse>) : BaseAdapter() {
    var context: Context? = context

    override fun getCount(): Int {
        return productList.size
    }

    override fun getItem(position: Int): Any {
        return productList[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    @SuppressLint("SetTextI18n", "ViewHolder", "InflateParams")
    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        //val food = this.productList[position]

        val inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val productView = inflator.inflate(R.layout.product_layout, null)
        //foodView.findViewById<ImageView>(R.id.img_product).setImageResource(R.drawable.tursu_logo)
        productView.findViewById<TextView>(R.id.product_id).text = this.productList[position].id.toString()
        productView.findViewById<TextView>(R.id.price_product).text = this.productList[position].price + " TL"
        productView.findViewById<TextView>(R.id.text_product).text = this.productList[position].name
        val image  = productView.findViewById<ImageView>(R.id.img_product)
        if(productList[position].photo_url!="") {
            Picasso
                    .get() // give it the context
                    .load(productList[position].photo_url) // load the image
                    .into(image)
        }
        else{
            image.setImageResource(R.drawable.ic_menu_camera)
        }
        //val url = URL(productList[position].photo_url)
        //val bmp = BitmapFactory.decodeStream(url.openConnection().getInputStream())
        //productView.findViewById<ImageView>(R.id.img_product).setImageBitmap(bmp)
        return productView
    }
}