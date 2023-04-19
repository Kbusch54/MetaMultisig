import React from "react";
import { ethers } from "ethers";

const EthConverstions = ({ ethValue, setEthValue, checkedBox }) => {
  const handleEthValue = (e) => {
    const key = e.target.id;
    const value = e.target.value;
    let arr = [];
    if (isNaN(value) || value === "") {
      setEthValue(arr);
    } else if (!ethers.BigNumber.isBigNumber(value) && isNaN(value)) {
      setEthValue(arr);
    } else {
      setEthValue(arr);
      switch (key) {
        case "wei":
          arr.push(ethers.utils.formatUnits(value, 18));
          arr.push(ethers.utils.formatUnits(value, 9).toString());
          arr.push(value.toString());
          setEthValue(arr);
          break;
        case "gwei":
          arr.push(ethers.utils.formatUnits(value, 9));
          arr.push(value);
          arr.push(Number(ethers.utils.parseUnits(value, "gwei")));
          setEthValue(arr);
          break;
        case "ether":
          arr.push(value);
          arr.push(Number(ethers.utils.parseUnits(value, "gwei")).toString());
          arr.push(Number(ethers.utils.parseUnits(value, 18)).toString());

          setEthValue(arr);

          break;

        default:
          break;
      }
    }
  };

  return (
    <div className={`${checkedBox ? "text-inherit" : "text-myGray"}`}>
      <ul className="flex flex-col">
        <li className="flex flex-row gap-x-2">
          <label className="w-12">Ether</label>
          <input
            className="border-2 border-blue-500 text-sm"
            id="ether"
            placeholder={ethValue[0]}
            value={ethValue[0]}
            type="number"
            disabled={!checkedBox}
            onChange={handleEthValue}
          />
        </li>
        <li className="flex flex-row gap-x-2">
          <label className="w-12">Gwei</label>
          <input
            className="border-2 border-blue-500 text-sm"
            id="gwei"
            placeholder={ethValue[1]}
            value={ethValue[1]}
            type="number"
            disabled={!checkedBox}
            onChange={handleEthValue}
          />
        </li>
        <li className="flex flex-row gap-x-2">
          <label className="w-12">Wei</label>
          <input
            className="border-2 border-blue-500 text-sm"
            id="wei"
            value={ethValue[2]}
            type="number"
            disabled={!checkedBox}
            onChange={handleEthValue}
          />
        </li>
      </ul>
      {checkedBox && ethValue[0] <= 0 && (
        <p className="absolute right-6 text-sm text-red-500">
          *Cannot have option Checked if not value is selected
        </p>
      )}
    </div>
  );
};

export default EthConverstions;
