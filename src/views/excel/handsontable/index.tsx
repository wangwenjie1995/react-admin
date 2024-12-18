import React, { useEffect, useRef, useState } from 'react'
import { Card, Button, Row, Col, Radio, Upload } from "antd"
import { HotTable } from '@handsontable/react-wrapper';
import { PageWrapper } from '@/components/Page'
import styles from './handsontable.module.less'

const onUploadExcel = () => {

}

const Handsontable: React.FC = () => {
  return (
    <PageWrapper>
      <div className={styles['handsontable-page']}>
        <div className={styles['handsontable-tools']}>
          <Row align="middle" gutter={8}>
            <Col>
              <Button onClick={onUploadExcel}>导入Excel</Button>
            </Col>
          </Row>
        </div>
        <div className={styles['handsontable-body']}>
          <HotTable
            data={[
              ['', 'Tesla', 'Volvo', 'Toyota', 'Ford'],
              ['2019', 10, 11, 12, 13],
              ['2020', 20, 11, 14, 13],
              ['2021', 30, 15, 12, 13]
            ]}
            rowHeaders={true}
            colHeaders={true}
            height="auto"
            autoWrapRow={true}
            autoWrapCol={true}
            licenseKey="non-commercial-and-evaluation" // for non-commercial use only
          />
        </div>
      </div>
    </PageWrapper >
  )
}

export default Handsontable

