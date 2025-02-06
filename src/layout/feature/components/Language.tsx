import { Dropdown, Tooltip } from "antd";
import SvgIcon from '@/components/SvgIcon'
import { LanguageEnum } from "@/enums/appEnum";
import useAppStore from "@/stores/modules/appStore";

const LanguageIcon = (props: any) => {
  const language = useAppStore((state) => state.language)
  const setLanguage = useAppStore((state) => state.setLanguage)
  const items = [
    {
      key: '1',
      label: <span>简体中文</span>,
      onClick: () => setLanguage?.(LanguageEnum.ZH),
      disabled: language === LanguageEnum.ZH
    },
    {
      key: '2',
      label: <span>English</span>,
      onClick: () => setLanguage?.(LanguageEnum.EN),
      disabled: language === LanguageEnum.EN
    }
  ]
  return (
    <Dropdown
      menu={{ items: items }}
      placement="bottom"
      trigger={['hover']}
      arrow={true}
    >
      <span className='icon-btn'>
        <SvgIcon name='language' size={20} />
      </span>
    </Dropdown>
  )
}

export default LanguageIcon;
