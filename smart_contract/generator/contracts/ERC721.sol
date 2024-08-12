// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * .########.##.......####.##....##.########..######..########..#######..##....##.########
 * .##.......##........##..###...##....##....##....##....##....##.....##.###...##.##......
 * .##.......##........##..####..##....##....##..........##....##.....##.####..##.##......
 * .######...##........##..##.##.##....##.....######.....##....##.....##.##.##.##.######..
 * .##.......##........##..##..####....##..........##....##....##.....##.##..####.##......
 * .##.......##........##..##...###....##....##....##....##....##.....##.##...###.##......
 * .##.......########.####.##....##....##.....######.....##.....#######..##....##.########
*/

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FlintStoneNFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdTracker;
    uint256 private _totalSupply;
    string private _baseTokenURI;
    address private _minter;
    bool private _frozen;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) {
        _minter = owner();
        _baseTokenURI = baseTokenURI;
    }

    modifier onlyMinter() {
        require(_msgSender() == minter());
        _;
    }
    
    function minter() public view virtual returns (address) {
        return _minter;
    }

    function setMinter(address newMinter) onlyOwner public virtual {
        _minter = newMinter;
    }

    function freeze() onlyOwner public {
        _frozen = true;
    }

    function frozen() public view returns (bool) {
        return _frozen;
    }

    function setBaseURI(string memory _newBaseURI) onlyOwner public {
        require(!frozen(), "frozen");
        _baseTokenURI = _newBaseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    function mint(address to, uint256 size) onlyMinter public virtual {
        require(!frozen(), "frozen");
        require(size >= 1 && size <= 50, "size must between 1 to 50");
        
        uint until = _tokenIdTracker.current() + size;
        while(_tokenIdTracker.current() < until) {
            uint tokenId = _tokenIdTracker.current();
            _mint(to, tokenId);
            _tokenIdTracker.increment();
            _totalSupply += 1;
        }
    }
}
