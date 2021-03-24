package edu.uclm.esi.carreful.service;

import java.io.IOException;
import java.util.Base64;

import org.jvnet.hk2.annotations.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import edu.uclm.esi.carreful.dao.ProductDao;
import edu.uclm.esi.carreful.model.Product;

@Service
public class ProductService {

	@Autowired
	private ProductDao productDao;
	
	public void saveProduct(MultipartFile file,String name,String price) throws IOException {
		Product p = new Product();
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());
		if(fileName.contains("..")) {
			System.out.println("Fichero no valido");
		}
		p.setImage(Base64.getEncoder().encodeToString(file.getBytes()));
		p.setNombre(name);
		p.setPrecio(price);
		productDao.save(p);
	}
}
