/*
 * Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

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

    // When false (default, VCOM), the dependent pin cascades with the main toggle: it is
    // forced off (and its toggle disabled) while main is off, and editable while main is
    // on. When true (DTR), the relationship is inverted: the dependent (enabler) pin is
    // forced on (and its toggle disabled) while the main toggle is on, and is freely
    // editable while main is off — i.e. enabling the main pin requires the enabler on.
    dependantRequiredWhenMainOn?: boolean;
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
    dependantRequiredWhenMainOn = false,
}: PinConfigPanelProps) => {
    logger.debug(`Rendering PinConfigPanel for ${portName}`);

    const dispatch = useDispatch();

    const mainEnabled = xor(
        useSelector(getConfigValue(mainPinEnable)),
        mainPinEnableInvert,
    );
    const dependantEnabled = xor(
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
                        isToggled={mainEnabled}
                        onToggle={enableMain => {
                            dispatch(
                                setConfigValue({
                                    configPin: mainPinEnable,
                                    configPinState: xor(
                                        enableMain,
                                        mainPinEnableInvert,
                                    ),
                                }),
                            );

                            if (dependantRequiredWhenMainOn) {
                                // DTR: enabling the main pin requires the dependent
                                // enabler pin to be on as well. When main is turned off,
                                // the dependent is left free (can remain on).
                                if (enableMain) {
                                    dispatch(
                                        setConfigValue({
                                            configPin: dependantPinEnable,
                                            configPinState:
                                                !dependantPinEnableInvert,
                                        }),
                                    );
                                }
                            } else {
                                // VCOM: the dependent (HWFC) pin cascades with the main
                                // toggle — also disconnect it when main is disconnected.
                                dispatch(
                                    setConfigValue({
                                        configPin: dependantPinEnable,
                                        configPinState: xor(
                                            enableMain,
                                            dependantPinEnableInvert,
                                        ),
                                    }),
                                );
                            }
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
                        disabled={
                            dependantRequiredWhenMainOn
                                ? mainEnabled
                                : !mainEnabled
                        }
                        isToggled={
                            dependantRequiredWhenMainOn
                                ? mainEnabled || dependantEnabled
                                : mainEnabled && dependantEnabled
                        }
                        onToggle={enableDependant => {
                            dispatch(
                                setConfigValue({
                                    configPin: dependantPinEnable,
                                    configPinState: xor(
                                        enableDependant,
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
