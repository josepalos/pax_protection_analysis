import React from 'react';
import styles from './Tabs.module.css'

const Tab = ({activeTab, label, onClick}) => {
    const getLiClass = () => {
        if(activeTab === label){
            return styles.tab_list_item + " " + styles.tab_list_active;
        }else{
            return styles.tab_list_item;
        }
    };

    return (
        <li
            className={getLiClass(label)}
            onClick={() => onClick(label)}
        >
            {label}
        </li>
    )
};

export default Tab;