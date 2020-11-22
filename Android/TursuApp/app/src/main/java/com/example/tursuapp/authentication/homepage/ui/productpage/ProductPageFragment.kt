package com.example.tursuapp.authentication.homepage.ui.productpage

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.authentication.Product


class ProductPageFragment : Fragment() {

    private lateinit var productPageViewModel: ProductPageModel

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        productPageViewModel = ViewModelProvider(this).get(ProductPageModel::class.java)
        val root = inflater.inflate(R.layout.fragment_productpage, container, false)
        val textView: TextView = root.findViewById(R.id.text_home)
        productPageViewModel.text.observe(viewLifecycleOwner, Observer {
            textView.text = it
        })
        val spinner = view?.findViewById<Spinner>(R.id.ColorDropdown)
        val spinner2 = view?.findViewById<Spinner>(R.id.SizeDropdown)
        val list: MutableList<String> = ArrayList()
        list.add("RANJITH")
        list.add("ARUN")
        list.add("JEESMON")
        val languages = list
        if (spinner != null) {
            val adapter = context?.let {
                ArrayAdapter(
                    it,
                    android.R.layout.simple_spinner_item, languages
                )
            }
            spinner.adapter = adapter

            spinner.onItemSelectedListener = object :
                AdapterView.OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>,
                                            view: View, position: Int, id: Long) {
                }

                override fun onNothingSelected(parent: AdapterView<*>) {
                    // write code to perform some action
                }
            }
        }
        if (spinner2 != null) {
            val adapter = context?.let {
                ArrayAdapter(
                    it,
                    android.R.layout.simple_spinner_item, languages
                )
            }
            spinner2.adapter = adapter

            spinner2.onItemSelectedListener = object :
                AdapterView.OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>,
                                            view: View, position: Int, id: Long) {
                }

                override fun onNothingSelected(parent: AdapterView<*>) {
                    // write code to perform some action
                }
            }
        }

        return root
    }



}