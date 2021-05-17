package edu.uclm.esi.carreful.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import edu.uclm.esi.carreful.model.OrderedProduct;

@Repository
public interface OrderedProductDao extends CrudRepository <OrderedProduct, String> {

}
