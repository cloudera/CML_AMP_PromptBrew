/*
 * ****************************************************************************
 *
 *  CLOUDERA APPLIED MACHINE LEARNING PROTOTYPE (AMP)
 *  (C) Cloudera, Inc. 2024
 *  All rights reserved.
 *
 *  Applicable Open Source License: Apache 2.0
 *
 *  NOTE: Cloudera open source products are modular software products
 *  made up of hundreds of individual components, each of which was
 *  individually copyrighted.  Each Cloudera open source product is a
 *  collective work under U.S. Copyright Law. Your license to use the
 *  collective work is as provided in your written agreement with
 *  Cloudera.  Used apart from the collective work, this file is
 *  licensed for your use pursuant to the open source license
 *  identified above.
 *
 *  This code is provided to you pursuant a written agreement with
 *  (i) Cloudera, Inc. or (ii) a third-party authorized to distribute
 *  this code. If you do not have a written agreement with Cloudera nor
 *  with an authorized and properly licensed third party, you do not
 *  have any rights to access nor to use this code.
 *
 *  Absent a written agreement with Cloudera, Inc. (“Cloudera”) to the
 *  contrary, A) CLOUDERA PROVIDES THIS CODE TO YOU WITHOUT WARRANTIES OF ANY
 *  KIND; (B) CLOUDERA DISCLAIMS ANY AND ALL EXPRESS AND IMPLIED
 *  WARRANTIES WITH RESPECT TO THIS CODE, INCLUDING BUT NOT LIMITED TO
 *  IMPLIED WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY AND
 *  FITNESS FOR A PARTICULAR PURPOSE; (C) CLOUDERA IS NOT LIABLE TO YOU,
 *  AND WILL NOT DEFEND, INDEMNIFY, NOR HOLD YOU HARMLESS FOR ANY CLAIMS
 *  ARISING FROM OR RELATED TO THE CODE; AND (D)WITH RESPECT TO YOUR EXERCISE
 *  OF ANY RIGHTS GRANTED TO YOU FOR THE CODE, CLOUDERA IS NOT LIABLE FOR ANY
 *  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE OR
 *  CONSEQUENTIAL DAMAGES INCLUDING, BUT NOT LIMITED TO, DAMAGES
 *  RELATED TO LOST REVENUE, LOST PROFITS, LOSS OF INCOME, LOSS OF
 *  BUSINESS ADVANTAGE OR UNAVAILABILITY, OR LOSS OR CORRUPTION OF
 *  DATA.
 *
 * ***************************************************************************
 */
import { Flex, Typography } from "antd";

import PromptBrew from "./PromptBrew";
import InformationSection from "./InformationSection";
import Logo from "./logo.png";
import VertaLogo from "./verta-logo.png";

function App() {
  return (
    <>
      <Flex justify="space-between">
        <img src={Logo} style={{ width: 300 }} />
        <img src={VertaLogo} style={{ height: 40, paddingTop: 20 }} />
      </Flex>
      <Flex vertical align="center" style={{ width: "100vw" }}>
        <Flex
          gap={20}
          wrap
          vertical
          align="center"
          justify="center"
          style={{ width: "100%", margin: "0 40px" }}
        >
          <Flex align="center" justify="center">
            <Typography.Title
              style={{
                color: "#333e47",
                letterSpacing: "-0.7px",
                fontWeight: "bold",
                marginTop: 20,
              }}
            >
              PromptBrew
            </Typography.Title>
          </Flex>
          <PromptBrew />
          <InformationSection />
        </Flex>
      </Flex>
    </>
  );
}

export default App;
