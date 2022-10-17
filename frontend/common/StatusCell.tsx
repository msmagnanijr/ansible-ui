import { CheckCircleIcon, ExclamationCircleIcon, QuestionCircleIcon, StopCircleIcon } from '@patternfly/react-icons'
import { useTranslation } from 'react-i18next'
import { getPatternflyColor, PatternFlyColor, TextCell } from '../../framework'

export function StatusCell(props: { status: string }) {
    const { t } = useTranslation()
    switch (props.status) {
        case 'disabled':
            return (
                <TextCell icon={<StopCircleIcon color={getPatternflyColor(PatternFlyColor.Grey)} />} iconSize="sm" text={t('Disabled')} />
            )
        case 'healthy':
            return (
                <TextCell icon={<CheckCircleIcon color={getPatternflyColor(PatternFlyColor.Green)} />} iconSize="sm" text={t('Healthy')} />
            )
        case 'completed':
            return (
                <TextCell
                    icon={<CheckCircleIcon color={getPatternflyColor(PatternFlyColor.Green)} />}
                    iconSize="sm"
                    text={t('Completed')}
                />
            )
        case 'successful':
            return (
                <TextCell
                    icon={<CheckCircleIcon color={getPatternflyColor(PatternFlyColor.Green)} />}
                    iconSize="sm"
                    text={t('Successful')}
                />
            )
        case 'failed':
            return (
                <TextCell
                    icon={<ExclamationCircleIcon color={getPatternflyColor(PatternFlyColor.Red)} />}
                    iconSize="sm"
                    text={t('Failed')}
                />
            )
        default:
            return (
                <TextCell
                    icon={<QuestionCircleIcon color={getPatternflyColor(PatternFlyColor.Blue)} />}
                    iconSize="sm"
                    text={t('Unknown')}
                />
            )
    }
}
