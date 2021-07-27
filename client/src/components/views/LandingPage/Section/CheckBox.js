import React, { useState } from "react";
import { Collapse, Checkbox } from "antd";

const { Panel } = Collapse;

function CheckBox(props) {
  const [Checked, setChecked] = useState([]);

  const handleToggole = (value) => {
    // 체크한 index를 구하고
    const currentIndex = Checked.indexOf(value);

    console.log(`currentIndex`, currentIndex);
    // state가 checked 되지 않으면 -1
    // state가 checked된 상태이면 해당 checked된 value의 index 번호가 출력

    // 전체 checked 된 state에서 현재 체크한 checkbox가 이미 있다면
    const newChecked = [...Checked];

    // (없다면) state를 넣어준다.
    if (currentIndex === -1) {
      newChecked.push(value);
      // 빼주고
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    props.handleFilters(newChecked);
  };

  const renderCheckboxLists = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox
          onChange={() => handleToggole(value._id)}
          checked={Checked.indexOf(value._id) === -1 ? false : true}
        />
        <span>{value.name}</span>
      </React.Fragment>
    ));

  return (
    <div>
      <Collapse defaultActiveKey={["0"]}>
        <Panel header="contienets" key="1">
          {renderCheckboxLists()}
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;
