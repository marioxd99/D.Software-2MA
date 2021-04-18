package edu.uclm.esi.carreful.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.uclm.esi.carreful.model.Product;

@Repository
public interface ProductDao extends JpaRepository <Product, String> {

	List<Product> findByCategoria(String categoria);

	Product findById(Long idFinal);

	void deleteById(Long id);

	Optional<Product> findByNombre(String nombre);
}
