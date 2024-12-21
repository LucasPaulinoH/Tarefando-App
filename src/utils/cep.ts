import axios from "axios";
import { Dispatch, SetStateAction } from "react";

const BRASIL_API_BASE_URL = "https://brasilapi.com.br/api/cep/v1";

export const fetchCep = async (
  cep: string,
  setStreet: Dispatch<SetStateAction<string>>,
  setDistrict: Dispatch<SetStateAction<string>>,
  setCity: Dispatch<SetStateAction<string>>,
  setState: Dispatch<SetStateAction<string>>
) => {
  try {
    const { data } = await axios.get(`${BRASIL_API_BASE_URL}/${cep}`);

    setStreet(data.street);
    setDistrict(data.neighborhood);
    setCity(data.city);
    setState(data.state);
  } catch (error) {
    console.error("Error fetching CEP: ", error);
  }
};
