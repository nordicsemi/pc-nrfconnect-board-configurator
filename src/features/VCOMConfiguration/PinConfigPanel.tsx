import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    logger,
    Overlay,
    Toggle,
} from '@nordicsemiconductor/pc-nrfconnect-shared';

import DirtyDot from '../../app/DirtyDot';
import {
    getConfigPinDirty,
    getConfigValue,
    setConfigValue,
} from '../Configuration/boardControllerConfigSlice';
import { xor } from './helpers';

import './vcomconfig.scss';

const Subtitle = ({
    title,
    dirty,
    hasTooltip,
}: {
    title: string;
    dirty: boolean;
    hasTooltip?: boolean;
}) => (
    <span>
        {title}
        {hasTooltip ? (
            <span className="mdi mdi-help-circle-outline tw-pl-1" />
        ) : null}
        <DirtyDot
            dirty={dirty}
            className="tw-absolute tw-ml-1 -tw-translate-y-2"
        />
    </span>
);

interface PinConfigPanelProps {
    portName: string;
    panelTitle: string;
    titleTooltip: string;
    dependentPinTitle: string;
    dependentPinTooltip?: string;

    mainPinEnable: number;
    dependantPinEnable: number;
    mainPinEnableInvert: boolean;
    dependantPinEnableInvert: boolean;
}

const PinConfigPanel = ({
    portName,
    panelTitle,
    titleTooltip,
    dependentPinTitle,
    dependentPinTooltip,
    mainPinEnable,
    dependantPinEnable,
    mainPinEnableInvert,
    dependantPinEnableInvert,
}: PinConfigPanelProps) => {
    logger.debug(`Rendering PinConfigPanel for ${portName}`);

    const dispatch = useDispatch();

    const vcomEnable = xor(
        useSelector(getConfigValue(mainPinEnable)),
        mainPinEnableInvert,
    );
    const hwfcEnable = xor(
        useSelector(getConfigValue(dependantPinEnable)),
        dependantPinEnableInvert,
    );

    const mainPinEnableDirty = useSelector(getConfigPinDirty(mainPinEnable));
    const dependantPinEnableDirty = useSelector(
        getConfigPinDirty(dependantPinEnable),
    );

    return (
        <Card>
            <Card.Header>
                <div>
                    <Toggle
                        isToggled={vcomEnable}
                        onToggle={enableVcom => {
                            dispatch(
                                setConfigValue({
                                    configPin: mainPinEnable,
                                    configPinState: xor(
                                        enableVcom,
                                        mainPinEnableInvert,
                                    ),
                                }),
                            );
                            // Also disconnect HWFC if VCOM is disconnected
                            dispatch(
                                setConfigValue({
                                    configPin: dependantPinEnable,
                                    configPinState: xor(
                                        enableVcom,
                                        dependantPinEnableInvert,
                                    ),
                                }),
                            );
                        }}
                    >
                        <Overlay
                            tooltipId={`tooltip_${portName}`}
                            tooltipChildren={
                                <div className="tw-preflight tw-flex tw-flex-col tw-gap-4 tw-bg-gray-900 tw-px-4 tw-py-2 tw-text-left tw-text-gray-100">
                                    <p className="tooltip-text">
                                        {titleTooltip.trim()}
                                    </p>
                                </div>
                            }
                        >
                            <span className="h5 tw-font-medium">
                                {panelTitle}{' '}
                                <span className="mdi mdi-help-circle-outline" />
                                <DirtyDot
                                    dirty={mainPinEnableDirty}
                                    className="tw-absolute tw-ml-1 -tw-translate-y-2"
                                />
                            </span>
                        </Overlay>
                    </Toggle>
                </div>
            </Card.Header>
            <Card.Body>
                <div>
                    <Toggle
                        disabled={!vcomEnable}
                        isToggled={hwfcEnable && vcomEnable}
                        onToggle={enableHwfc => {
                            dispatch(
                                setConfigValue({
                                    configPin: dependantPinEnable,
                                    configPinState: xor(
                                        enableHwfc,
                                        dependantPinEnableInvert,
                                    ),
                                }),
                            );
                        }}
                    >
                        {dependentPinTooltip ? (
                            <Overlay
                                tooltipId={`tooltip_hwfc_${portName}`}
                                tooltipChildren={
                                    <div className="tw-preflight tw-flex tw-flex-col tw-gap-4 tw-bg-gray-900 tw-px-4 tw-py-2 tw-text-left tw-text-gray-100">
                                        <p className="tooltip-text">
                                            {dependentPinTooltip.trim()}
                                        </p>
                                    </div>
                                }
                            >
                                <Subtitle
                                    title={dependentPinTitle}
                                    dirty={dependantPinEnableDirty}
                                    hasTooltip
                                />
                            </Overlay>
                        ) : (
                            <Subtitle
                                title={dependentPinTitle}
                                dirty={dependantPinEnableDirty}
                            />
                        )}
                    </Toggle>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PinConfigPanel;
