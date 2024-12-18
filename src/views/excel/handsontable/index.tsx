import React, { useEffect, useRef, useState } from 'react'
import { Card, Button, Row, Col, Radio, Upload } from "antd"
import { HotTable } from '@handsontable/react-wrapper';
import Handsontable from 'handsontable/base';
import { PageWrapper } from '@/components/Page'
import styles from './handsontable.module.less'
import {
  registerLanguageDictionary,
  getLanguagesDictionaries,
  zhCN,
} from 'handsontable/i18n';
import { useAppSelector } from '@/stores';
import { LanguageEnum } from '@/enums/appEnum';
import { registerAllModules } from 'handsontable/registry';
registerAllModules();
registerLanguageDictionary(zhCN);
// 定义语言映射
const languageMap: Record<LanguageEnum, string> = {
  [LanguageEnum.ZH]: 'zh-CN',
  [LanguageEnum.EN]: 'en-US',
}

const onUploadExcel = () => {

}
const data = [
  ['', 'Tesla', 'Volvo', 'Toyota', 'Ford'],
  ['2019', 10, 11, 12, 13],
  ['2020', 20, 11, 14, 13],
  ['2021', 30, 15, 12, 13]
]
const ExcelTable: React.FC = () => {
  const reduxLanguage = useAppSelector((state) => state.app.language) as LanguageEnum
  const [language, setLanguage] = useState(languageMap[reduxLanguage] || 'zh-CN')

  useEffect(() => {
    setLanguage(languageMap[reduxLanguage] || 'zh-CN')
  }, [reduxLanguage])
  return (
    <PageWrapper>
      <div className={styles['handsontable-page']}>
        <div className={styles['handsontable-tools']}>
          <Row align="middle" gutter={8}>
            <Col>
              <Button onClick={onUploadExcel}>导入Excel</Button>
            </Col>
            <Col>
              <Button onClick={onUploadExcel}>导出Excel</Button>
            </Col>
          </Row>
        </div>
        <div className={styles['handsontable-body']}>
          <HotTable
            data={data}
            rowHeaders={true}
            colHeaders={true}
            height="100%"
            width="100%"
            autoWrapRow={true}
            autoWrapCol={true}
            dropdownMenu={true}
            language={language}
            contextMenu={true}
            minSpareRows={50}  // 保证至少有20行
            minSpareCols={30}  // 保证至少有10列
            colWidths={100}         // 所有列宽度为100px
            rowHeights={30}         // 所有行高度为30px
            autoRowSize={true}
            licenseKey="non-commercial-and-evaluation" // for non-commercial use only
          />
        </div>
      </div>
    </PageWrapper >
  )
}

export default ExcelTable

