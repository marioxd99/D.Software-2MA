package edu.uclm.esi.carreful.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import edu.uclm.esi.carreful.model.Category;

public interface CategoryDao extends CrudRepository <Category, String> {
	@Query(value = "select nombre from category", nativeQuery=true)
	List<String> findCategorias();
	
	@Query(value = "select imagen from category where nombre=:nombre", nativeQuery=true)
	String getImagen(@Param("nombre") String nombre);
}
