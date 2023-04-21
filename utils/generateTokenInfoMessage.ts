import roundNumber from './roundNumber';

interface TokenSpecs {
  Token: {
    Name: string;
    Symbol: string;
    Address: string;
  };
  WithToken: {
    Symbol: string;
  };
  Pair: {
    Liquidity: number;
  };
  BuyTax: number;
  SellTax: number;
  MaxBuy: {
    Token: number;
    WithToken: number;
  } | null;
  MaxSell: {
    Token: number;
    WithToken: number;
  } | null;
  IsHoneypot: boolean;
  Error: string;
}

interface IsVarifedObj {
  HasProxyCalls: boolean;
  Contracts: {
    [address: string]: boolean;
  };
}

const generateTokenInfoMessage = (
  tokenSpecs: TokenSpecs,
  isVarifedObj: IsVarifedObj,
  address: string
): string => {
  const getInfoIsVarifed = () => {
    const hasProxyCalls = isVarifedObj.HasProxyCalls;
    const isVarifed = isVarifedObj.Contracts[address.toLowerCase()];
    let infoIsVarifed = '';
    if (isVarifed === false) {
      infoIsVarifed = `<b>Don't verived</b> `;
    }
    if (hasProxyCalls) {
      infoIsVarifed += `hasProxyCalls ${hasProxyCalls}`;
    }
    return infoIsVarifed;
  };

  const getBuyLimit = () => {
    if (tokenSpecs.MaxBuy !== null) {
      return (
        `buyLimit ${roundNumber(tokenSpecs.MaxBuy.Token)}/` +
        `${roundNumber(tokenSpecs.MaxBuy.WithToken)} ${tokenSpecs.WithToken.Symbol}\n`
      );
    }
    return 'buyLimit -';
  };

  const getSellLimit = () => {
    if (tokenSpecs.MaxSell !== null) {
      return (
        `selLimit ${roundNumber(tokenSpecs.MaxSell.Token)}/` +
        `${roundNumber(tokenSpecs.MaxSell.WithToken)} ${tokenSpecs.WithToken.Symbol}\n`
      );
    }
    return 'sellLimit -';
  };

  const isHoneypot = () => {
    if (tokenSpecs.IsHoneypot === false) {
      return '';
    }
    return `<b>honeypot ${tokenSpecs.IsHoneypot} (${tokenSpecs.Error})</b>`;
  };

  const getLiquidity = () => {
    const liqudity = roundNumber(tokenSpecs.Pair.Liquidity / 2);
    if (Number(liqudity) < 1) {
      return `<b>$0</b>`;
    }
    return `<b>${liqudity}</b>`;
  };

  const tokenInfoMessage = (
    `<b>${tokenSpecs.Token.Name} / ${tokenSpecs.Token.Symbol}</b>\n` +
    `${tokenSpecs.WithToken.Symbol} ${tokenSpecs.Token.Address}\n` +
    `${getLiquidity()} ${Math.round(tokenSpecs.BuyTax)}/${Math.round(tokenSpecs.SellTax)}\n` +
    `${getBuyLimit()} ${getSellLimit()}\n` +
    `${isHoneypot()}\n${getInfoIsVarifed()}`
  );

  return tokenInfoMessage;
};

export default generateTokenInfoMessage;