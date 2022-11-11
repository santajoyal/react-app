import logo from "./logo.svg";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useFormik } from "formik";
import axios from "axios";
import { useEffect, useState } from "react";
import {config} from "./config"

function App() {
  const [productlist, setProductlist] = useState([]);
  const [isedit,setEdit] = useState(false)
  const [productid,setProductid] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await axios.get(`${config.api}/products`);
        setProductlist(products.data);
      } catch (error) {
        alert("something went wrong");
      }
    };
    fetchData();
  }, []);
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
    },
    onSubmit: async (values) => {
      try {
        if(!isedit){
          const product = await axios.post(
            `${config.api}/product`,
            values
          );
          setProductlist([...productlist,{...values,_id: product.data.id}])
          formik.resetForm()
        }else{
          await axios.put(
            `${config.api}/product/${productid}`,
            values
          );
         const pindex = productlist.findIndex(p=>p.id == productid)
         productlist[pindex] = values
         setProductlist([...productlist])
         formik.resetForm()
         setEdit(false)
        }
      } catch (error) {
        alert("something went wrong");
      }
    },
  });

  const deleteproduct =async (id) =>{
 try {
  await axios.delete(`${config.api}/product/${id}`)
  const pindex = productlist.findIndex(p=>p._id == id)
  productlist.splice(pindex,1)
  setProductlist([...productlist])
 } catch (error) {
  alert("something went wrong")
 }
  }

  const editproduct = async(id)=>{
    try {
     const product = await axios.get(`${config.api}/product/${id}`)
      formik.setValues(product.data)
      setProductid(id)
      setEdit(true)
    } catch (error) {
      alert("something went wrong")
    }
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6">
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-lg-6">
                <label>Name</label>
                <input
                  type={"text"}
                  className="form-control"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="col-lg-6">
                <label>Price</label>
                <input
                  type={"text"}
                  className="form-control"
                  name="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-lg-6">
              <input
                  type={"submit"}
                  value={isedit ? "update" : "submit"}
                  className="btn btn-primary"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="col-lg-6">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {productlist.map((product, index) => {
                return (
                  <tr>
                    <th scope="row">{product._id}</th>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>
                    <button onClick={()=>editproduct(product._id)} className="btn btn-info btn-sm">Edit</button>
                      <button onClick={()=>deleteproduct(product._id)} className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
