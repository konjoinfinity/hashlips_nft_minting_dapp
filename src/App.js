import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect, pixelconnect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

let txreceipt = "";

export const StyledButton = styled.button`
  padding: 35px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 20px;
  font-size: 28px;
  font-weight: bold;
  color: var(--primary);
  width: 400px;
  cursor: pointer;
  box-shadow: 0px 10px 0px -2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(0, 0, 0, 0.3);
  margin-bottom: 1%;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  @media (max-width: 1100px) {
    width: 300px;
    font-size: 24px;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--secondary);
  padding: 25px;
  font-weight: bold;
  font-size: 25px;
  color: var(--primary);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  boxShadow: 0px 5px 11px 2px rgba(0,0,0,0.5),
  -webkit-box-shadow: 0px 5px 11px 2px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px 5px 11px 2px rgba(0,0,0,0.5);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 80%;
  @media (max-width: 1100px) {
    flex-direction: column;
  }
`;

export const Contain = styled.div`
  flex: 2;
  justify-content: center;
  align-items: center;
  padding: 5%;
`;

export const ResponsiveLow = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  @media (min-width: 1100px) {
    flex-direction: row;
  }
`;

export const TopText = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  background-color: var(--accent);
  border-radius: 20%;
  width: 450px;
  @media (max-width: 767px) {
    width: 300px;
    margin: 10%;
  }
`;

export const StyledBanner = styled.img`
  width: 40em;
  @media (max-width: 1100px) {
    width: 22em;
  }
`;

export const StyledIcon = styled.img`
  box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.1);
  background-color: #f9cfcb;
  border-radius: 20%;
  width: 50px;
  padding: 10px;
  margin: 5px;
`;

export const StyledSpec = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.3);
  background-color: #fcb1a3;
  border-radius: 20%;
  width: 4em;
  padding: 10px;
  margin: 5px;
`;

export const StyledHead = styled.img`
  box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--accent);
  border-radius: 20%;
  width: 5em;
  padding: 15px;
  margin: 5px;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

export const Footer = styled.div`
  width: 100%;
  padding: 3%;
  background-color: #fcb1a3;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNFT, setClaimingNFT] = useState(false);
  const [show2Dmint, setShow2Dmint] = useState(false)
  const [showPixelmint, setShowPixelmint] = useState(false)
  const [feedback, setFeedback] = useState(
    `Click to mint your Toxic Baebee NFT`
  );
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = (a) => {
    let cost = 0;
    if (a == true){
        setShowPixelmint(true)
        cost = 50000000000000000000
    } else {
      setShow2Dmint(true)
      cost = CONFIG.WEI_COST;
    }
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNFT(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNFT(false);
      })
      .then((receipt) => {
        console.log(receipt);
        txreceipt = receipt;
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it ==> `
        );
        setClaimingNFT(false);
        dispatch(fetchData(blockchain.account));
        console.log(blockchain);
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const showHide = (a) => {
    a ? setShowPixelmint(true) : setShow2Dmint(true)
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ background: "linear-gradient(#FFAB9C, #FEF7E9)" }}
      >
        <s.Container
          flex={1}
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            padding: 5,
            boxShadow: "0px 5px 11px 2px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#F9CFCB",
          }}
        >
          <a href="https://reautydao.io/" style={{ color: "var(--primary)" }}>
            <s.Container>
              <StyledHead
                alt={"linkedin"}
                src={"/config/images/reauty-new-logo-web3-04-1@2x.png"}
              />
            </s.Container>
          </a>
        </s.Container>
        <s.SpacerLarge />
        <s.TextTitle style={{ fontSize: "2.5em" }} id="mint">
          TOXIC BAEBEE NFTS
        </s.TextTitle>
        <s.TextTitle
          style={{
            textAlign: "center",
            fontSize: "2em",
            fontWeight: "bold",
            color: "#01CAFF",
          }}
        >
          ________
        </s.TextTitle>
        <s.SpacerSmall />
        <ResponsiveWrapper
          flex={1}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            justifySelf: "center",
          }}
        >
          <Card
            sx={{
              maxWidth: 500,
              maxHeight: "50%",
              padding: "2%",
              backgroundColor: "#FEF7E9",
            }}
          >
            <CardContent>
              <Typography gutterBottom variant="p" component="div">
                The Beauty Industry Lacks Transparency And Regulation. Beauty
                Consumers Are Frustrated With Misleading Information And
                Exaggerated Marketing Claims.
              </Typography>
              <s.SpacerXSmall />
              <Typography gutterBottom variant="p" component="div">
                This Deceptive Industry Which Idolizes The "Skinny And Beauty
                Culture," Leads Many Customers To Obtain Unnecessary Plastic
                Surgery, Unhealthy Eating Habits, And Unknowingly Use Beauty
                Products With Toxic Ingredients.
              </Typography>
              <s.SpacerXSmall />
              <Typography gutterBottom variant="p" component="div">
                The "Toxic Baebee" NFT Series Was Designed To Generate Public
                Awareness By Illustrating The "Toxic Side Of Beauty".
              </Typography>
            </CardContent>
            <CardActions>
              <s.Container
                flex={1}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "wrap",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                  <>
                    <s.TextTitle
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      The sale has ended.
                    </s.TextTitle>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      You can still find {CONFIG.NFT_NAME} on
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledLink
                      target={"_blank"}
                      href={CONFIG.MARKETPLACE_LINK}
                    >
                      {CONFIG.MARKETPLACE}
                    </StyledLink>
                  </>
                ) : (
                  <>
                    <s.SpacerXSmall />
                    <s.SpacerSmall />
                    {blockchain.account === "" ||
                    blockchain.smartContract === null ? (
                      <s.Container ai={"center"} jc={"center"}>
                        <s.SpacerSmall />
                        <StyledButton
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(connect());
                            getData();
                            showHide(false);
                          }}
                        >
                          Connect Your Wallet
                        </StyledButton>
                        {blockchain.errorMsg !== "" ? (
                          <>
                            <s.SpacerSmall />
                            <s.TextDescription
                              style={{
                                textAlign: "center",
                                color: "var(--accent-text)",
                              }}
                            >
                              {blockchain.errorMsg}
                            </s.TextDescription>
                          </>
                        ) : null}
                      </s.Container>
                    ) : (
                      <>
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                            fontSize: "25px",
                          }}
                        >
                          {feedback}
                          {txreceipt !== "" ? (
                            <a
                              href={`https://opensea.io/assets/matic/0x68e5167252b534ad3a50d559ab61ef6b84e1ee09/${txreceipt.events.Transfer.returnValues.tokenId}`}
                              target="_blank"
                            >
                              Opensea
                            </a>
                          ) : (
                            ""
                          )}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                          <StyledRoundButton
                            style={{ lineHeight: 0.4 }}
                            disabled={claimingNFT ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              decrementMintAmount();
                            }}
                          >
                            -
                          </StyledRoundButton>
                          <s.SpacerMedium />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--primary-text)",
                              fontSize: "25px",
                            }}
                          >
                            {mintAmount}
                          </s.TextDescription>
                          <s.SpacerMedium />
                          <StyledRoundButton
                            disabled={claimingNFT ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              incrementMintAmount();
                            }}
                          >
                            +
                          </StyledRoundButton>
                        </s.Container>
                        <s.SpacerSmall />
                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                          {show2Dmint ? 
                          <StyledButton
                            disabled={claimingNFT ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              claimNFTs(false);
                              getData();
                            }}
                          >
                            {claimingNFT ? "MINTING..." : "MINT - 25 MATIC"}
                          </StyledButton>
                           : ""}
                        </s.Container>
                      </>
                    )}
                  </>
                )}
              </s.Container>
            </CardActions>
          </Card>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/example.gif"} />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerLarge />
        <s.SpacerLarge />


        <s.SpacerLarge />
        <s.TextTitle style={{ fontSize: "2.5em" }}>
          TOXIC BAEBEE PIXELATED NFTS
        </s.TextTitle>
        <s.TextTitle
          style={{
            textAlign: "center",
            fontSize: "2em",
            fontWeight: "bold",
            color: "#01CAFF",
          }}
        >
          ________
        </s.TextTitle>
        <s.SpacerSmall />
        <ResponsiveWrapper
          flex={1}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            justifySelf: "center",
          }}
        >
          <Card
            sx={{
              maxWidth: 500,
              maxHeight: "50%",
              padding: "2%",
              backgroundColor: "#FEF7E9",
            }}
          >
            <CardContent>
              <Typography gutterBottom variant="p" component="div">
                The Beauty Industry Lacks Transparency And Regulation. Beauty
                Consumers Are Frustrated With Misleading Information And
                Exaggerated Marketing Claims.
              </Typography>
              <s.SpacerXSmall />
              <Typography gutterBottom variant="p" component="div">
                This Deceptive Industry Which Idolizes The "Skinny And Beauty
                Culture," Leads Many Customers To Obtain Unnecessary Plastic
                Surgery, Unhealthy Eating Habits, And Unknowingly Use Beauty
                Products With Toxic Ingredients.
              </Typography>
              <s.SpacerXSmall />
              <Typography gutterBottom variant="p" component="div">
                The "Toxic Baebee" NFT Series Was Designed To Generate Public
                Awareness By Illustrating The "Toxic Side Of Beauty".
              </Typography>
            </CardContent>
            <CardActions>
              <s.Container
                flex={1}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "wrap",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                  <>
                    <s.TextTitle
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      The sale has ended.
                    </s.TextTitle>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      You can still find {CONFIG.NFT_NAME} on
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledLink
                      target={"_blank"}
                      href={CONFIG.MARKETPLACE_LINK}
                    >
                      {CONFIG.MARKETPLACE}
                    </StyledLink>
                  </>
                ) : (
                  <>
                    <s.SpacerXSmall />
                    <s.SpacerSmall />
                    {blockchain.account === "" ||
                    blockchain.smartContract === null ? (
                      <s.Container ai={"center"} jc={"center"}>
                        <s.SpacerSmall />
                        <StyledButton
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(pixelconnect());
                            getData();
                            showHide(true);
                          }}
                        >
                          Connect Your Wallet
                        </StyledButton>
                        {blockchain.errorMsg !== "" ? (
                          <>
                            <s.SpacerSmall />
                            <s.TextDescription
                              style={{
                                textAlign: "center",
                                color: "var(--accent-text)",
                              }}
                            >
                              {blockchain.errorMsg}
                            </s.TextDescription>
                          </>
                        ) : null}
                      </s.Container>
                    ) : (
                      <>
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                            fontSize: "25px",
                          }}
                        >
                          {feedback}
                          {txreceipt !== "" ? (
                            <a
                              href={`https://opensea.io/assets/matic/0x527f243b04fcadaa6f6244f65d451bdea8cbfa92/${txreceipt.events.Transfer.returnValues.tokenId}`}
                              target="_blank"
                            >
                              Opensea
                            </a>
                          ) : (
                            ""
                          )}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                          <StyledRoundButton
                            style={{ lineHeight: 0.4 }}
                            disabled={claimingNFT ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              decrementMintAmount();
                            }}
                          >
                            -
                          </StyledRoundButton>
                          <s.SpacerMedium />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--primary-text)",
                              fontSize: "25px",
                            }}
                          >
                            {mintAmount}
                          </s.TextDescription>
                          <s.SpacerMedium />
                          <StyledRoundButton
                            disabled={claimingNFT ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              incrementMintAmount();
                            }}
                          >
                            +
                          </StyledRoundButton>
                        </s.Container>
                        <s.SpacerSmall />
                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                          {showPixelmint ?
                          <StyledButton
                            disabled={claimingNFT ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              claimNFTs(true);
                              getData();
                            }}
                          >
                            {claimingNFT ? "MINTING..." : "MINT - 50 MATIC"}
                          </StyledButton>
                          : ""}
                        </s.Container>
                      </>
                    )}
                  </>
                )}
              </s.Container>
            </CardActions>
          </Card>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/pixelated.gif"} />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerLarge />
        <s.SpacerLarge />

        <s.SpacerMedium />
        <s.TextTitle style={{ fontSize: "2.5em" }}>
          SPECIFICATIONS
        </s.TextTitle>
        <s.SpacerMedium />
        <s.SpacerMedium />
        <ResponsiveLow flex={1}>
          <s.Container
            flex={1}
            style={{
              padding: "1%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StyledBanner alt={"example"} src={"/config/images/toxbbs.png"} />
          </s.Container>
          <s.Container
            flex={2}
            style={{
              padding: 20,
              borderRadius: 24,
            }}
          >
            <s.Container
              flex={1}
              style={{
                padding: "1%",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Card
                sx={{
                  maxWidth: 375,
                  margin: "2%",
                  padding: "4%",
                  backgroundColor: "#FEF7E9",
                  height: 425
                }}
              >
                <CardMedia>
                  <StyledSpec
                    alt={"linkedin"}
                    src={"/config/images/profile@2x.svg"}
                  />
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    The Characters
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Each Unique Baebee Is Created By A Program That Generates
                    Over 170 Possible Traits These Include But Are Not Limited
                    To Expression, Headwear And Clothing. 4000 Toxic
                    Baebees Are 2D, 1000 Are Pixelated, And 7 Are 3D.
                  </Typography>
                </CardContent>
                <CardActions>
                <Link href="#char">
              <StyledButton style={{fontSize: 20, width: "auto"}}>See The Characters</StyledButton>
              </Link>
            </CardActions>
              </Card>

              <Card
                sx={{
                  maxWidth: 375,
                  margin: "2%",
                  padding: "4.5%",
                  backgroundColor: "#FEF7E9",
                  height: 425
                }}
              >
                <CardMedia>
                  <StyledSpec
                    alt={"linkedin"}
                    src={"/config/images/polygon.png"}
                  />
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    ERC-721
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    The Baebees NFT Contract That Governs Ownership Is A
                    Standard ERC-721 Which Is Compatible With Any Service Or
                    Exchange, And Purchasing Baebee Costs 25/50 MATIC - POLYGON And 3D Costs 0.2 ETH.
                  </Typography>
                </CardContent>
                <CardActions>
                <Link href="#mint">
              <StyledButton style={{fontSize: 20, width: "auto"}}>Mint an NFT</StyledButton>
              </Link>
            </CardActions>
              </Card>

              <Card
                sx={{
                  maxWidth: 375,
                  margin: "2%",
                  padding: "4%",
                  backgroundColor: "#FEF7E9",
                  height: 425
                }}
              >
                <CardMedia>
                  <StyledSpec
                    alt={"linkedin"}
                    src={"/config/images/utility.png"}
                  />
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Specialty
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Baebees NFTs are Convertable To Reautycoin (ERC 2.0 Token).
                    We Allow Our NFT Owner To Convert Their NFT To Our
                    Reautycoin, Please Check The Reautycoin Page To Learn More.
                  </Typography>
                </CardContent>
                <CardActions>
                <Link href="https://reautydao.io">
              <StyledButton style={{fontSize: 20, width: "auto"}}>Learn More</StyledButton>
              </Link>
            </CardActions>
              </Card>
            </s.Container>
            <s.SpacerMedium />
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
        </ResponsiveLow>
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.SpacerMedium />
        <s.TextTitle style={{ fontSize: "2.5em" }} id="char">
          CHARACTERS
        </s.TextTitle>
        <s.SpacerMedium />
        <s.SpacerMedium />
        <ResponsiveLow flex={1}>
          <s.Container
            flex={2}
            style={{
              padding: 20,
              borderRadius: 24,
            }}
          >
            <s.Container
              flex={1}
              style={{
                padding: "1%",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Card
                sx={{
                  maxWidth: 375,
                  margin: "1%",
                  padding: "2%",
                  backgroundColor: "#FEF7E9",
                  height: "33em"
                }}
              >
                <CardMedia
              component="img"
              height="260"
              image="/config/images/Unreal.png"
            />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  Unreal Baebee
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  At a time when the Internet unifies aesthetic standards, more and more people are undergoing plastic surgery, which is not only harmful to health but also a wrong value orientation. People should recognize their original appearance and natural charm.
                  </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  maxWidth: 375,
                  margin: "1%",
                  padding: "2%",
                  backgroundColor: "#FEF7E9",
                  height: "33em"
                }}
              >
                <CardMedia
              component="img"
              height="260"
              image="/config/images/Vampire.png"
            />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  Contaminated Baebee
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  Harmful cosmetic ingredients and non-degradable packaging threaten the planet's environment and contribute to global warming.
                   </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  maxWidth: 375,
                  margin: "1%",
                  padding: "2%",
                  backgroundColor: "#FEF7E9",
                  height: "33em"
                }}
              >
                <CardMedia
              component="img"
              height="260"
              image="/config/images/Zombie.png"
            />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  Poisoned Baebee
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  Harmful ingredients in cosmetics are invading our health, and their advertising slogans are corroding our minds.
                   </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  maxWidth: 375,
                  margin: "1%",
                  padding: "2%",
                  backgroundColor: "#FEF7E9",
                  height: "33em"
                }}
              >
                <CardMedia
              component="img"
              height="260"
              image="/config/images/Frida1.png"
            />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  Mask Baebee
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  Today's global society is gradually losing diversity; everyone wears a mask and becomes what the mainstream likes the mainstream demands, and behind this is the destruction of individuality.
                  </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  maxWidth: 375,
                  margin: "1%",
                  padding: "2%",
                  backgroundColor: "#FEF7E9",
                  height: "33em"
                }}
              >
                <CardMedia
              component="img"
              height="260"
              image="/config/images/Clown.png"
            />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  Joker Baebee
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                 Exaggerated advertisements and deformed aesthetics have created real-life clowns; the pain of plastic surgery failure and the poisoning of harmful cosmetics have turned the victim into another joker.
                   </Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  maxWidth: 375,
                  margin: "1%",
                  padding: "2%",
                  backgroundColor: "#FEF7E9",
                  height: "33em"
                }}
              >
                <CardMedia
              component="img"
              height="260"
              image="/config/images/Fire.png"
            />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  Fire Baebee
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  The fake beauty information, misleading advertisement, trials, and errors burn a lot of energy from us; we can not get what we want exactly, and the anger fire is coming up.
                  </Typography>
                </CardContent>
              </Card>
            </s.Container>
            </s.Container>
           </ResponsiveLow>

           <s.TextTitle style={{ fontSize: "2.5em" }}>
          3D TOXIC BAEBEES
        </s.TextTitle>
        <s.SpacerMedium />
        <s.SpacerMedium />
        <ResponsiveLow flex={1}>
          <s.Container
            flex={2}
            style={{
              padding: 20,
              borderRadius: 24,
            }}
          >
            <s.Container
              flex={1}
              style={{
                padding: "1%",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Card
                sx={{
                  maxWidth: 375,
                  margin: "1%",
                  padding: "2%",
                  backgroundColor: "#FEF7E9",
                  height: "50em"
                }}
              >
                <CardMedia
              component="img"
              height="260"
              image="/config/images/3d.gif"
            />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  Reauty DAO
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  We're so proud to introduce Reauty DAO to the world!
                  <br/><br/>
Reauty DAO community empowers all members with ownership, control, and monetization of their beauty-relevant data. Overall, community members have the power to build a new order in the beauty industry with transparency, inclusiveness, and authenticity supported by blockchain technology!
<br/><br/>
Creating a truly decentralized and trustworthy beauty community is vital for every beauty stakeholder worldwide, and we're excited to lead this disruptive beauty transformation. 
</Typography>
                </CardContent>
                <CardActions>
              <Link href="https://reautydao.io">
              <StyledButton style={{fontSize: 20, width: "auto"}}>Learn More</StyledButton>
              </Link>
            </CardActions>
              </Card>
              <Card
                sx={{
                  maxWidth: 375,
                  margin: "1%",
                  padding: "2%",
                  backgroundColor: "#FEF7E9",
                  height: "50em"
                }}
              >
                <CardMedia
              component="img"
              height="260"
              image="/config/images/3d1.gif"
            />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  Why NFTs?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  <br /><br />
The beauty industry needs to do better. We see firsthand how misleading marketing claims, exaggerated claims, and unrealistic expectations lead to unhealthy choices for our customers. That's why we're launching the first NFT series: Toxic Baebaee! Each variation is entirely customizable with 3D, Pixelated, and 2D so you can choose the best look. This NFT series will help raise awareness of the toxic beauty industry while empowering consumers to make healthier choices. 
<br /><br /><br /><br />
 </Typography>
                </CardContent>
                <CardActions>
                <Link href="#mint">
              <StyledButton style={{fontSize: 20, width: "auto"}}>Mint Now</StyledButton>
              </Link>
            </CardActions>
              </Card>
              <Card
                sx={{
                  maxWidth: 375,
                  margin: "1%",
                  padding: "2%",
                  backgroundColor: "#FEF7E9",
                  height: "50em"
                }}
              >
                <CardMedia
              component="img"
              height="260"
              image="/config/images/3d3.gif"
            />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  NFT Purchase = DAO Membership
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <br /><br />
                  It's Halloween season, and we're celebrating by slashing prices on Toxic Baebee NFTs from midnight on 31st Oct 2022 until 30th Nov 2022! <br/><br/>
The first 100 Toxic Baebee NFT owners will get 0.1 ETH worth of Reauty DAO membership, giving them access to all the community privileges and powers to improve the web3 beauty community. Don't miss out on this spooky deal!
<br /><br /><br />
             </Typography>
                </CardContent>
                <CardActions>
              <Link href="https://opensea.io/collection/3d-toxic-baebee">
              <StyledButton style={{fontSize: 20, width: "auto"}}>Purchase on Opensea</StyledButton>
              </Link>
            </CardActions>
              </Card>
            </s.Container>
            </s.Container>
           </ResponsiveLow>


        <s.SpacerLarge />
        <s.TextTitle style={{ fontSize: "2.5em" }}>
          RECENT MINTS
        </s.TextTitle>
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.Container
          flex={1}
          style={{
            padding: "1%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card sx={{ maxWidth: 250, margin: "1%", height: 410 }}>
            <CardMedia
              component="img"
              height="260"
              image="https://i.seadn.io/gae/_v-_d-QcL3fB2j96ZxUopcsHwr5WljtdzqIBRp42HRqlq-66d0Fp71aUfKPvhrzX6AoCRP6rc_rIEwqWsoZeRr-uqrWRm6zqP7PdonE?auto=format&w=1000"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Toxic Baebee #1
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="https://opensea.io/collection/toxic-baebee-nft-series">
                <Button size="small">View Collection</Button>
              </Link>
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 250, margin: "1%", height: 410 }}>
            <CardMedia
              component="img"
              height="260"
              image="https://i.seadn.io/gae/Yst4YG30_k7JxMUJ0E8g9jvdfEHz19Sxioye0L59VxifdtbWRiipnv062qwaRvlL9_C2fKxA8VmfjtjJ8VIb627wmmHQdr_rBh28dw?auto=format&w=1000"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
              Pixelated Toxic Baebee #1
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="https://opensea.io/collection/toxic-baebee-pixelated">
                <Button size="small">View Collection</Button>
              </Link>
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 250, margin: "1%", height: 410 }}>
            <CardMedia
              component="img"
              height="260"
              image="https://i.seadn.io/gae/tWeVD95U92BTHewJVhuJKEKGlPqhPnYreD4sPgRSyqtvLe8Al4WqNQxVVnF-LK3i24DrGg5fhBDsYXlUtV_Oww6t3kVz25bfFuvB?auto=format&w=1000"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Toxic Baebee #2
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="https://opensea.io/collection/toxic-baebee-nft-series">
                <Button size="small">View Collection</Button>
              </Link>
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 250, margin: "1%", height: 410 }}>
            <CardMedia
              component="img"
              height="260"
              image="https://i.seadn.io/gae/aPg03dyRekQ37GGxOSUXZMtv4KgTTdP3Gu2Z6WjtjDRbLgtq-RAgU3zJu9QAQeNlLHMoec2gKQqdz7AtosLDSDp3zUVGsLZa7ZPscg?auto=format&w=1000"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
              Pixelated Toxic Baebee #2
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="https://opensea.io/collection/toxic-baebee-pixelated">
                <Button size="small">View Collection</Button>
              </Link>
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 250, margin: "1%", height: 410 }}>
            <CardMedia
              component="img"
              height="260"
              image="https://i.seadn.io/gae/kZ6lOfyMfWLeV6XF4DaQ5IDot0b1i6brMq6SyoMUmiSWt3a1eNLhdIq8tl1FjF3tvzgOxVbhRT998RvvFijZyUFLAMPyrxQxxHbcSQ?auto=format&w=1000"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Toxic Baebee #3
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="https://opensea.io/collection/toxic-baebee-nft-series">
                <Button size="small">View Collection</Button>
              </Link>
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 250, margin: "1%", height: 410 }}>
            <CardMedia
              component="img"
              height="260"
              image="https://i.seadn.io/gae/1FB7wzleeD6z_3w6mKO6AFQIdYaAlQVkU0kRlFDNSFAm3MFn2mQjgW6ciPlSVj05nLt9VbPvAiSef-ZClbWsrrbvt6QnWT6WorYm?auto=format&w=1000"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
              Pixelated Toxic Baebee #3
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="https://opensea.io/collection/toxic-baebee-pixelated">
                <Button size="small">View Collection</Button>
              </Link>
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 250, margin: "1%", height: 410 }}>
            <CardMedia
              component="img"
              height="260"
              image="https://i.seadn.io/gae/kelXuNv6UZxFH89glmV2VfV4B0lKHkf-hugpXKGVIWjB1SCfTGmQQRwbPo76jNg7HTmLah0VzsYNUFEdshdzjKDZRlxLiQH_ewSXLQ?auto=format&w=1000"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Toxic Baebee #4
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="https://opensea.io/collection/toxic-baebee-nft-series">
                <Button size="small">View Collection</Button>
              </Link>
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 250, margin: "1%", height: 410 }}>
            <CardMedia
              component="img"
              height="260"
              image="https://i.seadn.io/gae/JMQvNe-FfHV-brDs5FFdoVSr8QvUkd-P0jRjmR_8JEDOLFHM6Cp017wyw2ESUhC4qVdMIhycp37ZNU1u2KiKDczRHS3XyExDPbqL?auto=format&w=1000"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Pixelated Toxic Baebee #4
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="https://opensea.io/collection/toxic-baebee-pixelated">
                <Button size="small">View Collection</Button>
              </Link>
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 250, margin: "1%", height: 410 }}>
            <CardMedia
              component="img"
              height="260"
              image="https://i.seadn.io/gae/05vPImS1AbUoJlERfli5dZP1xNPJM8qf_LZdZbLKh1641WanVeTefRFH7qGh0N6Yc5RokFT0LrgU7fy0znVcjlqDupJuG_GSOAgL8gY?auto=format&w=1000"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Toxic Baebee #5
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="https://opensea.io/collection/toxic-baebee-nft-series">
                <Button size="small">View Collection</Button>
              </Link>
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 250, margin: "1%", height: 410 }}>
            <CardMedia
              component="img"
              height="260"
              image="https://i.seadn.io/gae/SH11iMbRPCtycaD4lidAIAEI4j1j_VlU_zW9ruG6tuHm56zcOl1B1L9m0BSvcqfpWpUKga5G5hnYZZWeDQUMGx9Q1bCF0r8CbKaKwQ?auto=format&w=1000"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Pixelated Toxic Baebee #5
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="https://opensea.io/collection/toxic-baebee-pixelated">
                <Button size="small">View Collection</Button>
              </Link>
            </CardActions>
          </Card>
        </s.Container>
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.SpacerLarge />
        <Footer flex={1}>
          <s.TextTitle
            style={{
              textAlign: "left",
              color: "var(--primary)",
              fontSize: "20px",
              marginRight: "18%",
            }}
          >
            © Copyright ReautyDAO 2022
          </s.TextTitle>

          <a href="https://reautydao.io/" style={{ color: "var(--primary)" }}>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary)",
                marginRight: "15px",
              }}
            >
              {" "}
              Document
            </s.TextDescription>
          </a>
          <a
            href="https://www.blingyte.com/privacy-policy"
            style={{ color: "var(--primary)" }}
          >
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary)",
                marginRight: "15px",
              }}
            >
              {" "}
              Terms Of Service
            </s.TextDescription>
          </a>
          <a href="https://reautydao.io/" style={{ color: "var(--primary)" }}>
            <s.TextDescription
              style={{ textAlign: "center", color: "var(--primary)" }}
            >
              {" "}
              Traits & Rarities
            </s.TextDescription>
          </a>
          <a
            href="https://www.linkedin.com/company/blingy/"
            style={{ color: "var(--primary)", marginLeft: "18%" }}
          >
            <StyledIcon alt={"linkedin"} src={"/config/images/linkedin.png"} />
          </a>
          <a
            href="https://twitter.com/ReautyDao"
            style={{ color: "var(--primary)" }}
          >
            <StyledIcon alt={"linkedin"} src={"/config/images/twitter.png"} />
          </a>
          <a
            href="https://www.instagram.com/reautyapp/"
            style={{ color: "var(--primary)" }}
          >
            <StyledIcon alt={"linkedin"} src={"/config/images/igig.png"} />
          </a>
          <a href="https://reautydao.io/" style={{ color: "var(--primary)" }}>
            <StyledIcon alt={"linkedin"} src={"/config/images/discord.png"} />
          </a>
        </Footer>
      </s.Container>
    </s.Screen>
  );
}

export default App;
