package edu.uclm.esi.carreful.http;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import edu.uclm.esi.carreful.dao.CategoryDao;
import edu.uclm.esi.carreful.dao.ProductDao;
import edu.uclm.esi.carreful.model.Carrito;
import edu.uclm.esi.carreful.model.Product;

@RestController
@RequestMapping("product")
public class ProductController extends CookiesController {
	
	@Autowired
	private ProductDao productDao;
	@Autowired
	private CategoryDao categoryDao;
	
	@PutMapping("/add")
	public void add(@RequestBody Map<String, Object> info) {
		JSONObject jso = new JSONObject(info);
		String nombre = jso.optString("nombre");
		String precio = jso.optString("precio");
		String codigo = jso.optString("codigo");
		String categoria =  jso.optString("categoria");
		try {
			Product product = new Product();
			product.setNombre(nombre);
			product.setPrecio(precio);
			product.setCodigo(codigo);
			product.setCategoria(categoria);
			product.setImage(jso.optString("image"));
			productDao.save(product);
		} catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
		}
	}
	
	@GetMapping("/getTodos")
	public List<Product> get() {
		try {
			return productDao.findAll();
		} catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
		}
	}
	
	@GetMapping("/getCategorias")
	public List<String> getCategorias() {
		try {
			return categoryDao.findCategorias();
		} catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
		}
	}
	
	@GetMapping("/getCategoria/{categoria}")
	public List<Product> getCategoria(@PathVariable String categoria) {
		System.out.println("la categoria es "+categoria);
		try {
			return productDao.findByCategoria(categoria);
		} catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
		}
	}
	
	@GetMapping("/getImagen/{categoria}")
	public String getImagen(@PathVariable String categoria) {
		try {
			return categoryDao.getImagen(categoria);
		} catch(Exception e) {
			return null;
		}
	}
	
	@GetMapping("/getPrecio/{nombre}")
	public String getPrecio(@PathVariable String nombre) {
		try {
			Optional<Product> optProduct = productDao.findById(nombre);
			if (optProduct.isPresent())
				return optProduct.get().getPrecio();
			throw new Exception("El producto no existe");
		} catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
		}
	}
	
	@PostMapping("/addAlCarrito/{nombre}")
	public Carrito addAlCarrito(HttpServletRequest request, @PathVariable String nombre) {
		Carrito carrito = (Carrito) request.getSession().getAttribute("carrito");
		if (carrito==null) {
			carrito = new Carrito();
			request.getSession().setAttribute("carrito", carrito);
		}
		Product producto = productDao.findById(nombre).get();
		carrito.add(producto, 1);
		return carrito;
	}
	
	@Transactional
	@DeleteMapping("/borrarProducto/{id}")
	public void borrarProducto(@PathVariable Long id) {
		try {
			Product optProduct = productDao.findById(id);
			if (optProduct.isPresent())
				productDao.deleteById(id);
			else
				throw new Exception("El producto no existe");
		} catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
		}
	}
	
	@PutMapping("/editar")
	public void editar(@RequestBody Map<String, Object> info) {
		try {
			JSONObject jso = new JSONObject(info);
			String id = jso.optString("id");
			Long idFinal = Long.valueOf(id);
			String nombre = jso.optString("nombre");
			String precio = jso.optString("precio");
			String codigo = jso.optString("codigo");
			String image =  jso.optString("image");
			Product product =  productDao.findById(idFinal);
			product.setNombre(nombre);
			product.setPrecio(precio);
			product.setCodigo(codigo);
			product.setImage(image);
			System.out.println("El imagen es "+image);
			productDao.save(product);
		} catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
		}
			
	}
}
