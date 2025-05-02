import React, { useEffect, useRef, useState } from 'react'
import { Card, Button, Row, Col, Radio, Upload } from "antd"
import { HotTable, HotTableRef } from '@handsontable/react-wrapper';
import Handsontable from 'handsontable/base';
import { PageWrapper } from '@/components/Page'
import styles from './handsontable.module.less'
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import {
  registerLanguageDictionary,
  getLanguagesDictionaries,
  zhCN,
} from 'handsontable/i18n';
import { LanguageEnum } from '@/enums/appEnum';
import { registerAllModules } from 'handsontable/registry';
import useAppStore from '@/stores/modules/appStore';
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
  {
    brand: 'Jetpulse',
    model: 'Racing Socks',
    price: 30,
    sellDate: 'Oct 11, 2023',
    sellTime: '01:23 AM',
    inStock: false,
  },
  {
    brand: 'Gigabox',
    model: 'HL Mountain Frame',
    price: 1890.9,
    sellDate: 'May 3, 2023',
    sellTime: '11:27 AM',
    inStock: false,
  },
  {
    brand: 'Camido',
    model: 'Cycling Cap',
    price: 130.1,
    sellDate: 'Mar 27, 2023',
    sellTime: '03:17 AM',
    inStock: true,
  },
  {
    brand: 'Chatterpoint',
    model: 'Road Tire Tube',
    price: 59,
    sellDate: 'Aug 28, 2023',
    sellTime: '08:01 AM',
    inStock: true,
  },
  {
    brand: 'Eidel',
    model: 'HL Road Tire',
    price: 279.99,
    sellDate: 'Oct 2, 2023',
    sellTime: '13:23 AM',
    inStock: true,
  },
]
const columns = [
  {
    type: 'text',
    data: 'brand',
  },
  {
    type: 'text',
    data: 'model',
  },
  {
    type: 'numeric',
    data: 'price',
    numericFormat: {
      pattern: '$ 0,0.00',
      culture: 'en-US',
    },
  },
  {
    type: 'date',
    data: 'sellDate',
    dateFormat: 'MMM D, YYYY',
    correctFormat: true,
    className: 'htRight',
  },
  {
    type: 'time',
    data: 'sellTime',
    timeFormat: 'hh:mm A',
    correctFormat: true,
    className: 'htRight',
  },
  {
    type: 'checkbox',
    data: 'inStock',
    className: 'htCenter',
  },
]

const ExcelTable: React.FC = () => {
  const reduxLanguage = useAppStore((state) => state.language)
  const [language, setLanguage] = useState(languageMap[reduxLanguage] || 'zh-CN')
  const hotRef = useRef<HotTableRef>(null)
  const hot = hotRef.current?.hotInstance;
  const onExportCsvFile = () => {
    const hot = hotRef.current?.hotInstance;
    const exportPlugin = hot?.getPlugin('exportFile');

    exportPlugin?.downloadFile('csv', {
      bom: false,
      columnDelimiter: ',',
      columnHeaders: false,
      rowHeaders: false,
      exportHiddenColumns: true,
      exportHiddenRows: true,
      fileExtension: 'csv',
      filename: 'Handsontable-CSV-file_[YYYY]-[MM]-[DD]',
      mimeType: 'text/csv',
      rowDelimiter: '\r\n',
    });
  }
  useEffect(() => {
    setLanguage(languageMap[reduxLanguage] || 'zh-CN')
  }, [reduxLanguage])
  return (
    <PageWrapper>
      <div className={styles['handsontable-page']}>
        <div className={styles['handsontable-tools']}>
          <Row align="middle" gutter={8}>
            {/* <Col>
              <Button onClick={onUploadExcel}>导入Excel</Button>
            </Col> */}
            <Col>
              <Button onClick={onExportCsvFile}>导出Excel</Button>
            </Col>
          </Row>
        </div>
        <div className={styles['handsontable-body']}>
          <HotTable
            ref={hotRef}
            data={data}
            rowHeaders={true}
            colHeaders={true}
            columnSorting={true}
            columns={columns}
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
            rowHeights={35}         // 所有行高度为30px
            autoRowSize={true}
            stretchH="all"
            licenseKey="non-commercial-and-evaluation" // for non-commercial use only
          />
        </div>
      </div>
    </PageWrapper >
  )
}

export default ExcelTable
