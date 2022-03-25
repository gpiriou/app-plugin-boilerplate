import "core-js/stable";
import "regenerator-runtime/runtime";
import {
  waitForAppScreen,
  zemu,
  genericTx,
  nano_models,
  SPECULOS_ADDRESS,
  txFromEtherscan,
  resolutionConfig,
  loadConfig,
} from "./test.fixture";
import ledgerService from "@ledgerhq/hw-app-eth/lib/services/ledger";
import { ethers } from "ethers";
import { parseEther, parseUnits } from "ethers/lib/utils";

const contractAddr = "0x9a065e500cdcd01c0a506b0eb1a8b060b0ce1379";
const pluginName = "boilerplate";

nano_models.forEach(function (model) {
  test(
    "[Nano " + model.letter + "] swap",
    zemu(model, async (sim, eth) => {
      let unsignedTx = genericTx;

      unsignedTx.to = contractAddr;
      // https://snowtrace.io/tx/0xed4480a4ea78338c365d16a3218c051dec565bda7cab6cd4d47da70005fb9f89
      unsignedTx.data =
        "0x51227094000000000000000000000000000000000000000000000000000000000000005d0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000006e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000205a65726f45780000000000000000000000000000000000000000000000000000000000000000000000000000a32608e873f9ddef944b24798db69d80bbb4d1ed00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000680000000000000000000000000a32608e873f9ddef944b24798db69d80bbb4d1ed0000000000000000000000006e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000005e8415565b0000000000000000000000000a32608e873f9ddef944b24798db69d80bbb4d1ed0000000000000000000000006e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000fc4635ec823a33700000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003a000000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a32608e873f9ddef944b24798db69d80bbb4d1ed0000000000000000000000006e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002a00000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000025472616465724a6f65000000000000000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000fc4635ec823a337000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000060ae616a2155ee3d9a68541ba4544862310933d400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a32608e873f9ddef944b24798db69d80bbb4d1ed0000000000000000000000006e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a32608e873f9ddef944b24798db69d80bbb4d1ed000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000000000000000000000c5a7746b5f6239b7f2000000000000000000000000000000000000000000000000";
      unsignedTx.value = parseEther("1");

      // Create serializedTx and remove the "0x" prefix
      const serializedTx = ethers.utils
        .serializeTransaction(unsignedTx)
        .slice(2);

      const resolution = await ledgerService.resolveTransaction(
        serializedTx,
        loadConfig,
        resolutionConfig
      );

      const tx = eth.signTransaction("44'/60'/0'/0", serializedTx, resolution);

      const right_clicks = model.letter === "S" ? 5 : 3;

      // Wait for the application to actually load and parse the transaction
      await waitForAppScreen(sim);
      await sim.navigateAndCompareSnapshots(".", model.name + "_swap", [
        right_clicks,
        0,
      ]);

      await tx;
    })
  );
});
