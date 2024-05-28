import { Request , Response } from "express";
import pool from "../Database_cmd/db_cmd";

export async function validateSim(req: Request, res: Response){
    //
    const { simNumber, serviceNumber } = req.body;
  
    const getOfferQuery = `SELECT so.offer_id, so.offer_name, so.call_qty, so.data_qty, so.duration, so.cost FROM SimDetails sd JOIN SimOffers so ON sd.sim_id = so.sim_id WHERE sd.sim_number = '${simNumber}'AND sd.service_number = '${serviceNumber}' LIMIT 1`;
  
    pool.query(getOfferQuery, (error, result) => {
      try {
        if (result.rows.length > 0) {
          const data = `${result.rows[0].call_qty} calls + ${result.rows[0].data_qty} GB for Rs.${result.rows[0].cost}, validity: ${result.rows[0].duration}`;
          res.status(200).json({ success: true, data: data });
        } else {
          res
            .status(404)
            .json({
              error:
                "Invalid details, please check again Subscriber Identity Module (SIM) number/Service number!",
            });
          // throw new Error("Invalid details, please check again Subscriber Identity Module (SIM) number/Service number!")
        }
      } catch (err) {
        res.status(500).json({ error: "Some error occured" });
      }
    });
  };

export async function validateCust(req: Request, res: Response){
    const { emailaddress, dateofbirth } = req.body;
    const getCustomerQuery = `SELECT * FROM customeridentity WHERE email_address = '${emailaddress}' AND date_of_birth = '${dateofbirth}' LIMIT 1`;
    // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}$/;
    // const emailRegex = regex.test(emailaddress);
    // if (!emailRegex) {
    //   return res.json({ error: "Invalid email address" });
    // }
    // const regex2 = /^\d{4}-\d{2}-\d{2}$/;
    // const dateRegex = regex2.test(dateofbirth);
    // if (!dateRegex) {
    //   return res.json({ error: "Invalid date of birth" });
    // }
    try {
      // pool.query(getCustomerQuery, (error, result) => {
      //     if (result.rows.length > 0) {
      //         res.status(200).json({success:true,data:result.rows[0]});
      //     }
      //     else {
      //         res.status(404).json({ error: "Invalid details, please check again Customer Identity Module (CIM) email address/Date of Birth!" });
      //     }
      // });
      const validatecustomer = await pool.query(getCustomerQuery);
      if (validatecustomer.rows.length > 0) {
        return res
          .status(200)
          .json({
            success: true,
            message: "Customer details validated successfully",
          });
      }
      else{
        return res
        .status(500)
        .json({ error: "Invalid Customer! This Customer doesn't exist" });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Invalid Customer! This Customer doesn't exist" });
    }
  };

  export async function validateCustomerPersonalDetails(req: Request, res: Response) {
    const { first_name, last_name, confirm_email } = req.body;
    const getCustomerQuery = `SELECT * FROM customeridentity WHERE first_name = '${first_name}' AND last_name = '${last_name}' AND email_address = '${confirm_email}' LIMIT 1`;
    const firstnameregex = /^[a-zA-Z]{1,15}$/;
    const firstname = firstnameregex.test(first_name) && firstnameregex.test(last_name);

    if (!firstname) {
        return res.status(400).json({
            error: "Firstname/Lastname should be a maximum of 15 characters and accept only alphabets",
        });
    }

    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailRegex = regex.test(confirm_email);
    if (!emailRegex) {
        return res.status(400).json({ error: "Invalid email address" });
    }

    try {
        const validatecustomer = await pool.query(getCustomerQuery);
        if (validatecustomer.rows.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Customer details validated successfully",
            });
        } else {
            return res.status(404).json({ error: "Customer Not Found" });
        }
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


export async function updateCustomerAddress(req: Request, res: Response){
    const uniqueid = req.params.unique_id_number;
    const customerQuery = `SELECT * FROM customeraddress WHERE unique_id_number = $1`;
    const customerResult = await pool.query(customerQuery, [uniqueid]);
    
    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: "Customer Not Found" });
    }
    const { address, city, pincode, state } = req.body;

    if (address.length > 25) {
      return res.status(400).json({ error: "Address should be maximum of 25 characters" });
    }
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ error: "Pin should be 6-digit number" });
    }
    if (!(/^[a-zA-Z\s]+$/.test(city) && /^[a-zA-Z\s]+$/.test(state))) {
      return res.status(400).json({error:"City/State should not contain any special characters except space",});
    }
    // const customerQuery = `SELECT * FROM customeraddress WHERE unique_id_number = $1`;
    // const customerResult = await pool.query(customerQuery, [uniqueid]);
    
    // if (customerResult.rows.length === 0) {
    //   return res.status(404).json({ error: "Customer Not Found" });
    // }

    // const updateAddressQuery = `INSERT INTO customeraddress (address, city, pincode, state, unique_id_number) 
    // VALUES ($1, $2, $3, $4, $5) 
    // ON CONFLICT (unique_id_number) DO UPDATE 
    // SET address = EXCLUDED.address, city = EXCLUDED.city, pincode = EXCLUDED.pincode, state = EXCLUDED.state 
    // RETURNING *;
    // `;
    const updateAddressQuery = `UPDATE customeraddress SET address = '${address}', city = '${city}', pincode = '${pincode}', state = '${state}' WHERE unique_id_number = '${uniqueid}' RETURNING *;`;
    try{
    const updatedAddress = await pool.query(updateAddressQuery);
    res.status(200).json({success: true,message: "Customer address updated successfully"})
    }
    catch(err){
        res.status(500).json({ error: "Some error occured" });
    }
    

    // console.log("updated");
    // const values = [uniqueid, address, pincode, city, state];
    // console.log(values);
    // try {
    //   const updatedAddress = await pool.query(updateAddressQuery);
    //   console.log("Updated Address:", updatedAddress);
    //   res.status(200).json({success: true,message: "Address updated successfully", address: updatedAddress.rows[0],
    //     });
    // } catch (err) {
    //   console.log("fdgdg");
    //   res.status(500).json({ error: "Some error occured" });
    // }
}


export async function validateCustomerUnique(req:Request, res:Response){
    const { aadharNumber , first_name , last_name , date_of_birth } = req.body;
    if (!/^\d{15}$/.test(aadharNumber)) {
        return res.status(400).json({ error: "Id should be 15 digits" });
    }

    // Check if first name, last name, and dob are provided and in correct format
    if (!first_name || !last_name || !date_of_birth || !/^\d{4}-\d{2}-\d{2}$/.test(date_of_birth)) {
        return res.status(400).json({ error: "Invalid details - Enter the first name and last name , date of birth is yyyy-mm-dd" });
    }
    const validatequery = `SELECT * FROM customer WHERE unique_id_number = '${aadharNumber}' AND first_name = '${first_name}' AND last_name = '${last_name}' AND date_of_birth = '${date_of_birth}'`;
    try {
        const validateuser = await pool.query(validatequery);
        if (validateuser.rows.length === 0) {
            return res.status(404).json({ error: "Invalid Customer! This Customer doesn't exist" });
        }
        const updatingquery = `UPDATE simdetails
        SET sim_status = 'active'
        FROM customer
        WHERE simdetails.sim_id = customer.sim_id
        AND customer.unique_id_number = '${aadharNumber}'`;
        await pool.query(updatingquery);
        res.status(200).json({ success: true, message: "Valid Customer : SIM activated successfully" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Some error occurred" });
    }
    // const validateuser = await pool.query(validatequery);
    // if(!validateuser){
    //     return res.status(500).json({ error: "Invalid Customer! This Customer doesn't exist" });
    // }
    // const updatingquery = `UPDATE SimDetails
    // SET SimDetails.sim_status = 'active'
    // FROM CUSTOMER
    // WHERE SimDetails.sim_id = CUSTOMER.sim_id`;
    // try{
    //     const updated = await pool.query(updatingquery);
    // }catch(err){
    //     res.status(500).json({ error: "Some error occured" });
    // }



}
export async function GetData (req: Request, res: Response){
  const selectQuery = 'SELECT * FROM customer';
  try {
      const result = await pool.query(selectQuery);
      console.log(result);
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.json({ message: 'Error occured while fetching students' });
  }
}
  