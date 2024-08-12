const BaseERC721 = artifacts.require('BaseERC721');

const data = {
  id: '',
  supply: 0,
  symbol: '',
  name: '',
  tokenURI:'',
};

export default async function (deployer) {
  try {
    const { name, symbol, tokenURI } = data;
    await deployer.deploy(BaseERC721, name, symbol, tokenURI);

    let instance = await BaseERC721.deployed();
    data.contractAddress = instance.address;
    
  } catch (e) {
    console.error(e);
  }
  console.log(data);
};
