import React from 'react';
import Tab from './Tab';
import styles from './Tabs.module.css';

const Tabs = ({activeTab, setActiveTab, children}) => {
    const onClickTabItem = (tab) => {
        setActiveTab(tab);
    }

    return (
        <div>
            <ol className={styles.tab_list}>
                {children.map((child) => {
                    const {label} = child.props;

                    return (
                        <Tab
                            activeTab={activeTab}
                            key={label}
                            label={label}
                            onClick={onClickTabItem}
                        />
                    )
                })}
            </ol>
            <div className={styles.tab_content}>
                {children.map((child) => {
                    if(child.props.label !== activeTab) return undefined;
                    return child.props.children;
                })}
            </div>
        </div>
    )
};

export default Tabs;