import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useMainContract } from '../hooks/useMainContract';

interface FormInfo {
  title: string;
  description: string;
  owner: string;
  price: number | null;
}

interface DataInfo {
  name: string;
  description: string;
  image: string;
  price: number | null;
  owner: string | null;
}

function Create() {
  const { sendIncrement } = useMainContract();
  const [nftimage, setNFTImage] = useState<File>();
  const [forminfo, setFormInfo] = useState<FormInfo>({
    title: "",
    description: "",
    owner: "",
    price: null
  });

  useEffect(() => {
    document.title = "Create";
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files[0]) {
      
      setNFTImage(event.target.files[0]);
    }
  };

  const handleEvent = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!nftimage) {
      return;
    }

    const suss = await sendIncrement(0.05);
    console.log(suss)

    const formData = new FormData();
    formData.append('file', nftimage.target.files[0]);

    try {
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `01fde9c5bfe02c0ae7f3`,
          pinata_secret_api_key: `1ad2cf854fd951a91a9dd8d1e26404bc4cb107bf46bd2d5d9b60a1185f36b98f`,
          "Content-Type": "multipart/form-data",
        },
      });

      const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;

      const info: DataInfo = {
        name: forminfo.title,
        description: forminfo.description,
        image: ImgHash,
        price: forminfo.price,
        owner: forminfo.owner
      };
      await pinJSONToPinata(info);
    } catch (error) {
      console.error(error);
    }
  };

  const pinJSONToPinata = async (info: DataInfo) => {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    const headers = {
      'Content-Type': 'application/json',
      'pinata_api_key': `dedc16b75664bc108136`,
      'pinata_secret_api_key': `2b8fc356900683c32c2c59356ce60d2a97d2561b2d89d95efda9d02b399e44c8`
    };

    try {
      const res = await axios.post<PinataResponse>(url, info, { headers });
      const meta = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      console.log(meta);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='h-screen pt-24'>
      <div className="container-fluid mt-5 text-left">
        <div className="content mx-auto">
          <form className="max-w-sm mx-auto">
            <div className='max-w-lg mx-auto'>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="user_avatar">Upload Video</label>
              <input onChange={changeHandler} name="file" className="block w-full mb-4 h-8 text-m  text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" />
            </div>
            <div className="mb-4">
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">NFT Name</label>
              <input onChange={handleChange} type="text" id="title" name='title' className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter NFT name" required />
            </div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
            <textarea onChange={handleChange} name="description" id="description" rows={4} className="block p-2.5 w-full text-sm  mb-4 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..."></textarea>
            <div className="mb-4">
              <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
              <input onChange={handleChange} type="number" name='price' id="price" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder='0.001' required />
            </div>
            <div className='text-center'>
              <button onClick={handleEvent} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                Mint NFT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Create;
