package com.example.tursuapp.authentication.homepage.ui.home

import android.content.Context
import android.media.Image
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.GridView
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.authentication.Product


class HomeFragment : Fragment() {

    private lateinit var homeViewModel: HomeViewModel
    var adapter: ProductAdapter? = null
    var productList = ArrayList<Product>()

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        homeViewModel =
                ViewModelProvider(this).get(HomeViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_home, container, false)
        val textView: TextView = root.findViewById(R.id.text_home)
        homeViewModel.text.observe(viewLifecycleOwner, Observer {
            textView.text = it
        })
        return root
    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // load foods
        productList.add(Product("Product1", R.drawable.tursu_logo))
        productList.add(Product("Product2", R.drawable.tursu_logo))
        productList.add(Product("Product3", R.drawable.tursu_logo))
        productList.add(Product("Product4",R.drawable.tursu_logo))
        productList.add(Product("Product5", R.drawable.tursu_logo))
        productList.add(Product("Product6", R.drawable.tursu_logo))
        productList.add(Product("Product7", R.drawable.tursu_logo))
        productList.add(Product("Product8", R.drawable.tursu_logo))
        adapter = context?.let { ProductAdapter(it, productList) }
        val gridView = view.findViewById<GridView>(R.id.gridView)
        gridView.adapter = adapter
    }

    class ProductAdapter : BaseAdapter {
        var productList = ArrayList<Product>()
        var context: Context? = null

        constructor(context: Context, foodsList: ArrayList<Product>) : super() {
            this.context = context
            this.productList = foodsList
        }

        override fun getCount(): Int {
            return productList.size
        }

        override fun getItem(position: Int): Any {
            return productList[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val food = this.productList[position]

            val inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
            val foodView = inflator.inflate(R.layout.product_layout, null)
            foodView.findViewById<ImageView>(R.id.img_product).setImageResource(R.drawable.tursu_logo)
            foodView.findViewById<TextView>(R.id.text_product).text = "deneme"
            return foodView
        }
    }
}