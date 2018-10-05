// @flow

import React from 'react'
import { Image } from 'react-native'

import iconImage from '../../assets/images/otp/OTP-badge_sm.png'
import s from '../../locales/strings.js'
import { PrimaryButton, SecondaryButton } from '../../modules/UI/components/Buttons/index.js'
import Text from '../../modules/UI/components/FormattedText'
import { InteractiveModal } from '../../modules/UI/components/Modals/index.js'

// Define the modal like normal-ish:
export const OtpModal = (props: any) => (
  <InteractiveModal>
    <InteractiveModal.Icon>
      <Image source={iconImage} />
    </InteractiveModal.Icon>

    <InteractiveModal.Title>
      <Text style={{ textAlign: 'center' }}>{s.strings.title_otp_keep_modal}</Text>
    </InteractiveModal.Title>
    <InteractiveModal.Body>
      <InteractiveModal.Description style={{ textAlign: 'center' }}>{s.strings.otp_modal_reset_description}</InteractiveModal.Description>
    </InteractiveModal.Body>
    <InteractiveModal.Footer>
      <InteractiveModal.Row>
        <InteractiveModal.Item>
          {/* re-enable OTP */}
          <PrimaryButton
            onPress={() => {
              props.onDone(true)
            }}
          >
            <PrimaryButton.Text>{s.strings.otp_keep}</PrimaryButton.Text>
          </PrimaryButton>
        </InteractiveModal.Item>
      </InteractiveModal.Row>
      <InteractiveModal.Row>
        <InteractiveModal.Item>
          {
            // The modal gets an `onDone` property, which resolves the promise:
          }
          <SecondaryButton onPress={() => props.onDone(false)}>
            <SecondaryButton.Text>{s.strings.otp_disable}</SecondaryButton.Text>
          </SecondaryButton>
        </InteractiveModal.Item>
      </InteractiveModal.Row>
    </InteractiveModal.Footer>
  </InteractiveModal>
)
